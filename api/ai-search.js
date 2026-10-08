const axios = require('axios');
const { createLimiter } = require('../lib/rate-limit');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!TMDB_API_KEY) {
    module.exports = (req, res) => res.status(500).json({ error: 'TMDB_API_KEY not configured' });
    return;
}
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w780';

const languageMap = {
    'pt-BR': 'pt-BR', 'en': 'en-US', 'es': 'es-ES',
    'zh-CN': 'zh-CN', 'zh-HK': 'zh-TW', 'ja': 'ja-JP',
    'ru': 'ru-RU', 'ko': 'ko-KR'
};

const RATE_LIMIT = 10;
const CACHE_DURATION = 60 * 60 * 1000;
const ALLOWED_ORIGIN = 'https://cineworld-site.vercel.app';

// Duas protecoes distintas: o limite por IP segura abuso por requisicao, e o
// RATE_LIMIT acima segura o consumo total da chave do Gemini (custo por token).
const checkAiSearchRate = createLimiter({
    limit: 20,
    message: 'Muitas buscas por IA. Tente novamente em instantes.'
});

let requestCount = 0;
let lastReset = Date.now();
const cache = new Map();

const genreMap = {
    'acao': 28, 'action': 28,
    'comedia': 35, 'comedy': 35,
    'romance': 10749, 'amor': 10749, 'love': 10749,
    'terror': 27, 'horror': 27,
    'ficcao': 878, 'scifi': 878,
    'fantasia': 14, 'fantasy': 14,
    'anime': 16, 'animacao': 16,
    'drama': 18,
    'thriller': 53, 'suspense': 53,
    'misterio': 9648, 'mystery': 9648,
    'familia': 10751, 'family': 10751,
    'guerra': 10752, 'war': 10752,
    'crime': 80,
    'aventura': 12, 'adventure': 12,
    'documentario': 99
};

const themeKeywordIds = {
    'lesbico': [264386, 319872],
    'lesbiana': [264386, 319872],
    'lesbian': [264386, 319872],
    'wlw': [264386, 319872],
    'gay': [264386],
    'lgbt': [264386],
    'homosexual': [264386],
    'trans': [4237],
    'queer': [264386],
    'drag': [4240]
};

const contextKeywords = {
    ...themeKeywordIds,
    'lgbt': [264386, 319872, 315382, 315383],
    'dinossauro': [470],
    'dinosaur': [470],
    'infantil': [10751, 16],
    'crianca': [10751, 16],
    'criança': [10751, 16],
    'familia': [10751],
    'kids': [10751]
};

const langMap = {
    'coreano': 'ko', 'japones': 'ja', 'japonesa': 'ja',
    'chines': 'zh', 'chinês': 'zh',
    'hindi': 'hi', 'indiano': 'hi',
    'brasileiro': 'pt', 'brasil': 'pt',
    'americano': 'en', 'ingles': 'en',
    'espanhol': 'es', 'mexicano': 'es',
    'frances': 'fr', 'francês': 'fr',
    'italiano': 'it'
};

const decadeMap = {
    'anos 50': [1950, 1959],
    'anos 60': [1960, 1969],
    'anos 70': [1970, 1979],
    'anos 80': [1980, 1989],
    'anos 90': [1990, 1999],
    'anos 2000': [2000, 2009],
    'anos 2010': [2010, 2019],
    'anos 2020': [2020, 2029]
};

function resetRateLimit() {
    const now = Date.now();
    if (now - lastReset > 60000) {
        requestCount = 0;
        lastReset = now;
    }
}

function isRateLimited() {
    resetRateLimit();
    return requestCount >= RATE_LIMIT;
}

function getCachedResult(query) {
    const cached = cache.get(query);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        return cached.result;
    }
    return null;
}

function setCachedResult(query, result) {
    cache.set(query, { result, timestamp: Date.now() });
    if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
}

function extractDecade(query) {
    const q = query.toLowerCase();
    for (const [pattern, years] of Object.entries(decadeMap)) {
        if (q.includes(pattern)) {
            return years;
        }
    }
    const yearMatch = query.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
    if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        return [year, year + 9];
    }
    return null;
}

function extractFilters(query) {
    const q = query.toLowerCase();
    const filters = { genre: null, language: null, keywords: [], decade: null, year: null };
    
    filters.decade = extractDecade(query);
    
    const yearMatch = query.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch && !filters.decade) {
        filters.year = parseInt(yearMatch[1]);
    }
    
    for (const [kw, id] of Object.entries(genreMap)) {
        if (q.includes(kw)) { filters.genre = id; break; }
    }
    
    for (const [kw, code] of Object.entries(langMap)) {
        if (q.includes(kw)) { filters.language = code; break; }
    }
    
    const queryLower = query.toLowerCase();

    for (const [keyword, ids] of Object.entries(themeKeywordIds)) {
        if (queryLower.includes(keyword) && ids.length > 0) {
            filters.keywords.push(...ids);
        }
    }
    
    if (!filters.genre && filters.keywords.length > 0) {
        filters.genre = 10749;
    }
    
    return filters;
}

function cleanKeywords(query) {
    const stop = ['filme', 'movie', 'que', 'com', 'uma', 'um', 'para', 'de', 'do', 'da', 'em', 'e', 'o', 'a', 'os', 'as', 'meu', 'minha', 'seu', 'sua', 'acho', 'lembro', 'tipo', 'parecido', 'onde', 'assisti', 'vi'];
    return query.toLowerCase()
        .replace(/\d{4}/g, ' ')
        .split(/[\s,\-.;!?'"()]+/)
        .filter(w => w.length > 2 && !stop.includes(w))
        .slice(0, 5);
}

// Remove diacriticos e normaliza para minúsculas, para que a detecção de intenção
// case tanto "não lembro" quanto "nao lembro" (e tambem "então"/"entao", "avião"/"aviao").
// NFD primeiro, para funcionar com texto decomposto (comum em teclado mobile).
function fold(s) {
    return String(s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\u00df/g, 'ss')
        .toLowerCase()
        .trim();
}

const IDENTIFY_TRIGGERS = [
    'filme onde', 'filme que', 'filme sobre', 'filme de um', 'filme de uma',
    'movie where', 'movie about', 'film where',
    'procuro um filme', 'estou procurando',
    'lembro de um filme', 'lembro que', 'assisti um filme', 'vi um filme',
    'qual o nome do filme', 'qual filme', 'que filme',
    'condenado', 'medo do escuro', 'preso', 'prisao',
    'homem negro', 'menino', 'menina', 'garoto', 'garota'
];

function detectIdentifyIntent(query) {
    const raw = String(query || '').trim();
    const q = fold(raw);
    if (q.length < 15) return false;
    for (const t of IDENTIFY_TRIGGERS) {
        if (q.includes(t)) return true;
    }
    const words = q.split(/\s+/).filter(Boolean);
    const hasPlotVerb = /(onde|quando|depois|entao|porque|medo|morre|mata|descobre|viaja|perde|encontra|ajuda|salva|foge|volta|filho|filha|guerra|fantasma|alien|robo|zumbi|vampiro|magia|escola|hospital|navio|aviao|ilha|floresta|policial|ladrao|medico|crianca|negro|pobre|rico|sonho|tempo|futuro)\b/.test(q);
    const hasVague = /(parece|acho que|tipo|aquele filme|nao lembro|esqueci)\b/.test(q);
    if ((words.length >= 8 && hasPlotVerb) || (words.length >= 6 && hasVague)) return true;
    return false;
}

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;
const AXIOS_TIMEOUT = 10000;

function geminiUrl() {
    return GEMINI_URL;
}

function extractJsonObject(text) {
    const match = String(text || '').match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
        return JSON.parse(match[0]);
    } catch (e) {
        return null;
    }
}

async function callGeminiJSON(systemInstruction, userText, maxTokens, temperature) {
    if (!GEMINI_API_KEY || isRateLimited()) return null;
    requestCount++;
    try {
        const body = {
            contents: [{ parts: [{ text: userText }] }],
            generationConfig: {
                temperature: temperature ?? 0.2,
                maxOutputTokens: maxTokens || 600,
                responseMimeType: 'application/json'
            }
        };
        if (systemInstruction) {
            body.systemInstruction = { parts: [{ text: systemInstruction }] };
        }
        const response = await axios.post(geminiUrl(), body,
            { headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY }, timeout: AXIOS_TIMEOUT + 2000 }
        );
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return extractJsonObject(text);
    } catch (e) {
        console.error('Gemini JSON error:', e.message);
        return null;
    }
}

async function callGeminiSmart(query) {
    const contextPrompt = `You are a movie search expert. Analyze this user query and extract what they're actually looking for.

User query: "${query}"

Analyze and return JSON with:
- "mood": What vibe/mood they want (relaxante, triste, engraçado, assustador, romantico, etc)
- "context": What's the context (pra assistir com familia, sozinho, com amigos, pra dormir, etc)
- "specifics": Any specific things mentioned (gatos, cachorros, robos, zombies, etc)
- "keywords": Traditional search keywords to use
- "genre_override": Override genre if detected (comedy, drama, horror, etc)
- "exclude_genres": Genres to avoid

Examples:
- "filme relaxante com gatos" -> {"mood": "light/relaxing", "context": "casual viewing", "specifics": ["cats", "animals"], "keywords": ["cat", "comedy", "family"], "genre_override": "comedy"}
- "filme pra chorar" -> {"mood": "emotional/sad", "context": "alone", "keywords": ["cry", "tearjerker", "emotional"], "genre_override": "drama"}
- "filme assustador pra dormir tarde" -> {"mood": "scary/tense", "context": "night viewing", "keywords": ["horror", "scary", "thriller"], "genre_override": "horror"}
- "comédia romântica indiana" -> {"mood": "romantic/fun", "context": "date night", "specifics": ["indian"], "keywords": ["indian", "romance"], "genre_override": "romance"}

Output JSON only, no extra text:`;

    return callGeminiJSON(null, contextPrompt, 300, 0.1);
}

const IDENTIFY_SYSTEM = 'Você é o IDENTIFICADOR DE FILMES do CineWorld. REGRA ABSOLUTA: você só responde sobre identificação de filmes a partir da descrição do usuário. É PROIBIDO responder qualquer outro assunto. Se não for sobre filme, retorne {"refused": true}. Quando for sobre filme, deduza o título mais provável a partir de fragmentos de enredo e personagens. Sempre retorne 1 filme principal + até 3 alternativas. Nunca invente filmes: só cite títulos reais. Se não tiver certeza, reduza o confidence. Responda SOMENTE JSON: {"refused": false, "primary_title": "Original Title", "primary_title_pt": "Título PT", "primary_year": 1999, "confidence": 0.95, "reason_pt": "motivo 1-2 frases", "candidates": [{"title": "Original", "title_pt": "PT", "year": 1999, "reason_pt": "motivo"}]}';

async function callGeminiIdentify(query, language) {
    const userText = 'Identifique o filme. Descrição: "' + String(query).substring(0, 400) + '". Idioma da resposta: ' + (language || 'pt-BR') + '. Exemplo: "filme onde um homem negro com boa personalidade e condenado a morte e tem medo do escuro" -> {"refused": false, "primary_title": "The Green Mile", "primary_title_pt": "A Espera de um Milagre", "primary_year": 1999, "confidence": 0.97, "reason_pt": "John Coffey e um homem negro gentil condenado a morte que tem medo do escuro.", "candidates": [{"title": "The Shawshank Redemption", "title_pt": "Um Sonho de Liberdade", "year": 1994, "reason_pt": "Prisão e corredor da morte, pode confundir."}, {"title": "Dead Man Walking", "title_pt": "Os Ultimos Passos de um Homem", "year": 1995, "reason_pt": "Drama sobre condenado a morte."}]}. Outro: "filme de um navio que afunda e um casal se separa" -> primary Titanic (1997). Responda SOMENTE JSON.';
    const result = await callGeminiJSON(IDENTIFY_SYSTEM, userText, 700);
    if (!result || result.refused) return null;
    if (!result.primary_title && !(result.candidates && result.candidates.length)) return null;
    return result;
}

function normalizeTitle(value) {
    return String(value || '').trim();
}

function releaseYearOf(movie) {
    return String(movie?.release_date || '').substring(0, 4);
}

function toMovieCard(movie, overviewOverride) {
    return {
        ...movie,
        overview: overviewOverride ?? movie.overview,
        poster_path: movie.poster_path ? TMDB_IMAGE + movie.poster_path : null,
        backdrop_path: movie.backdrop_path ? TMDB_BACKDROP + movie.backdrop_path : null
    };
}

async function tmdbGet(path, params) {
    const response = await axios.get(TMDB_BASE + path, {
        params: { api_key: TMDB_API_KEY, ...params },
        timeout: AXIOS_TIMEOUT
    });
    return response.data;
}

async function searchMovieOnTmdb(title, tmdbLang, year) {
    const query = normalizeTitle(title);
    if (query.length < 2) return [];
    const params = { language: tmdbLang, page: 1, query, include_adult: false };
    if (year && Number(year) > 1900) params.year = Number(year);
    const data = await tmdbGet('/search/movie', params);
    return data.results || [];
}

async function validateIdentifyCandidates(candidates, tmdbLang) {
    const validated = [];
    const seen = new Set();
    for (const candidate of (candidates || []).slice(0, 4)) {
        try {
            const list = await searchMovieOnTmdb(candidate.title || candidate.title_pt, tmdbLang, candidate.year);
            if (!list.length) continue;
            let best = list[0];
            if (candidate.year) {
                const exact = list.find(m => releaseYearOf(m) === String(candidate.year));
                if (exact) best = exact;
            }
            if (seen.has(best.id)) continue;
            seen.add(best.id);
            let overview = best.overview || '';
            try {
                const details = await tmdbGet(`/movie/${best.id}`, { language: tmdbLang });
                overview = details.overview || overview;
                best.vote_average = details.vote_average ?? best.vote_average;
            } catch (e) { /* mantem overview da busca */ }
            validated.push({
                tmdb: toMovieCard(best, overview),
                reason_pt: candidate.reason_pt || '',
                title_pt: candidate.title_pt || null
            });
        } catch (e) {
            console.error('TMDB validate error:', e.message);
        }
    }
    return validated;
}

async function optionalWebGrounding(query) {
    const cxKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cxId = process.env.GOOGLE_SEARCH_CX;
    if (!cxKey || !cxId) return [];
    try {
        const res = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: { key: cxKey, cx: cxId, q: ('filme ' + query).substring(0, 120), num: 5 },
            timeout: 10000
        });
        return (res.data.items || []).map(it => ({ title: it.title, snippet: it.snippet, link: it.link }));
    } catch (e) { console.error('Web grounding error:', e.message); return []; }
}

const MAX_REASON_CHARS = 220;

function trimText(value, max) {
    const text = String(value || '').trim();
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, '') + '...';
}

function buildIdentifyAnswer(primary, validated, language) {
    const isPt = String(language || 'pt-BR').startsWith('pt');
    const mainTitle = primary.title_pt || primary.tmdb.title || primary.tmdb.original_title;
    const year = releaseYearOf(primary.tmdb);
    const titleWithYear = `"${mainTitle}"${year ? ` (${year})` : ''}`;
    const others = validated.filter(v => v.tmdb.id !== primary.tmdb.id).slice(0, 3);
    const otherTitles = others.map(o => {
        const label = isPt ? (o.title_pt || o.tmdb.title) : (o.tmdb.original_title || o.tmdb.title);
        const otherYear = releaseYearOf(o.tmdb);
        return `"${label}"${otherYear ? ` (${otherYear})` : ''}`;
    });
    // O Gemini so devolve justificativa em portugues (reason_pt). Nos demais
    // idiomas usamos a sinopse do TMDB, que ja vem no idioma solicitado, para
    // não misturar português dentro de uma resposta em inglês.
    const reason = isPt
        ? trimText(primary.reason_pt, MAX_REASON_CHARS)
        : trimText(primary.tmdb.overview, MAX_REASON_CHARS);
    const lead = isPt ? `O filme mais provável é ${titleWithYear}` : `The most likely movie is ${titleWithYear}`;
    const othersLabel = isPt ? 'Outras possibilidades' : 'Other possibilities';
    let answer = lead;
    if (reason) answer += ` — ${reason}`;
    if (otherTitles.length) answer += `. ${othersLabel}: ${otherTitles.join(', ')}.`;
    return answer;
}

function candidateSummary(item) {
    return {
        id: item.tmdb.id,
        title: item.tmdb.title,
        original_title: item.tmdb.original_title,
        title_pt: item.title_pt,
        year: releaseYearOf(item.tmdb),
        reason_pt: item.reason_pt
    };
}

function buildIdentifyPayload(identified, validated, webHits, language) {
    const primary = validated[0];
    primary.reason_pt = identified.reason_pt || primary.reason_pt;
    primary.title_pt = identified.primary_title_pt || primary.title_pt;
    return {
        page: 1,
        total_pages: 1,
        mode: 'identify',
        ai_answer: buildIdentifyAnswer(primary, validated, language),
        ai_confidence: identified.confidence ?? null,
        primary: candidateSummary(primary),
        candidates: validated.map(candidateSummary),
        results: validated.map(v => v.tmdb),
        web_grounding: webHits,
        grounded: true
    };
}

async function handleIdentifyMode(q, language, tmdbLang, cacheKey, res) {
    try {
        const identified = await callGeminiIdentify(q, language);
        if (!identified) return null;
        const webHits = await optionalWebGrounding(q);
        const candidates = [
            { title: identified.primary_title, title_pt: identified.primary_title_pt, year: identified.primary_year, reason_pt: identified.reason_pt },
            ...(identified.candidates || [])
        ];
        const validated = await validateIdentifyCandidates(candidates, tmdbLang);
        if (!validated.length) return null;
        const payload = buildIdentifyPayload(identified, validated, webHits, language);
        setCachedResult(cacheKey, payload);
        res.json(payload);
        return true;
    } catch (e) {
        console.error('Identify flow error:', e.message);
        return null;
    }
}

const THEME_SEARCH_TERMS = [
    { match: ['lesbico', 'lesbiana', 'lesbian', 'wlw'], terms: ['lesbian romance', 'lesbian love', 'wlw movie', 'girl love movie'] },
    { match: ['gay'], terms: ['gay romance', 'gay love', 'gay movie'] },
    { match: ['trans'], terms: ['trans movie', 'transgender story'] },
    { match: ['queer'], terms: ['queer film', 'queer movie'] }
];

const MOOD_KEYWORD_IDS = {
    'relaxing': [210024, 190413],
    'light': [210024, 190413],
    'fun': [41075, 179103],
    'emotional': [110505, 105140],
    'sad': [110505],
    'scary': [4200, 8711],
    'tense': [106961, 4315],
    'romantic': [5344, 3172],
    'romance': [5344, 3172],
    'dark': [4344, 4179],
    'uplifting': [210024, 186030]
};

function themeSearchTerms(queryLower, fallback) {
    for (const entry of THEME_SEARCH_TERMS) {
        if (entry.match.some(term => queryLower.includes(term))) return entry.terms;
    }
    return [fallback];
}

function moodKeywordIds(mood) {
    const moodLower = String(mood || '').toLowerCase();
    for (const [moodName, ids] of Object.entries(MOOD_KEYWORD_IDS)) {
        if (moodLower.includes(moodName)) return ids;
    }
    return [];
}

function addMoviesToMap(resultsMap, movies) {
    for (const movie of movies || []) {
        if (!resultsMap.has(movie.id)) {
            resultsMap.set(movie.id, toMovieCard(movie));
        }
    }
}

async function searchWithFilters(query, keywords, filters, tmdbLang) {
    const resultsMap = new Map();
    const baseParams = { language: tmdbLang, page: 1, 'vote_count.gte': 5 };
    const queryLower = query.toLowerCase();

    if (filters.keywords.length > 0) {
        for (const term of themeSearchTerms(queryLower, query)) {
            if (resultsMap.size >= 15) break;
            try {
                const data = await tmdbGet('/search/movie', { ...baseParams, query: term, sort_by: 'popularity.desc' });
                addMoviesToMap(resultsMap, data.results);
            } catch (e) {
                console.error('Search error:', e.message);
            }
        }
    }

    if (filters.genre && resultsMap.size < 5) {
        const discoverParams = { ...baseParams, sort_by: 'popularity.desc', with_genres: filters.genre };
        if (filters.language) discoverParams.with_original_language = filters.language;
        try {
            const data = await tmdbGet('/discover/movie', discoverParams);
            addMoviesToMap(resultsMap, data.results);
        } catch (e) {
            console.error('Genre discover error:', e.message);
        }
    }

    const needsMore = () => resultsMap.size < 15;
    const extraSearches = [];
    if (filters.decade && resultsMap.size < 10) {
        extraSearches.push(...keywords.filter(kw => kw.length >= 3).map(kw => ({ query: kw, year: filters.decade[0] })));
    }
    if (keywords.length > 0 && resultsMap.size < 5) {
        extraSearches.push(...keywords.filter(kw => kw.length >= 3).map(kw => ({ query: kw })));
    }
    for (const search of extraSearches) {
        if (!needsMore()) break;
        try {
            const data = await tmdbGet('/search/movie', { ...baseParams, ...search });
            addMoviesToMap(resultsMap, data.results);
        } catch (e) {
            console.error('Keyword search error:', e.message);
        }
    }
    
    return Array.from(resultsMap.values()).slice(0, 20);
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { q = '', page = 1, language = 'pt-BR' } = req.query;

    if (!q || String(q).trim().length < 2 || String(q).length > 500) {
        return res.status(400).json({ error: 'Query inválida' });
    }

    if (!checkAiSearchRate(req, res)) return;

    const cacheKey = `${q}_${language}`;
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
        return res.json(cachedResult);
    }

    const tmdbLang = languageMap[language] || 'pt-BR';
    const pageNum = Math.max(1, Math.min(500, parseInt(page) || 1));

    // MODO 1 — IDENTIFICAR filme pela descrição (estilo Google).
    if (detectIdentifyIntent(q)) {
        if (await handleIdentifyMode(q, language, tmdbLang, cacheKey, res)) return;
        // Cai para o fluxo normal de recomendação se a identificação falhar.
    }

    const filters = extractFilters(q);
    const keywords = cleanKeywords(q);
    
    try {
        const geminiResult = await callGeminiSmart(q);
        const hints = applyGeminiHints(keywords, filters, geminiResult);

        const movies = await searchWithFilters(q, hints.enhancedKeywords, filters, tmdbLang);
        const finalMovies = await enrichWithMoodAndSpecifics(movies, hints, tmdbLang);
        const finalResult = await buildRecommendPayloadFromQuery(finalMovies, q, pageNum, tmdbLang);

        setCachedResult(cacheKey, finalResult);
        return res.json(finalResult);
    } catch (error) {
        return sendFallbackResults(q, tmdbLang, pageNum, cacheKey, res, error);
    }
};

function applyGeminiHints(keywords, filters, geminiResult) {
    let enhancedKeywords = keywords;
    if (geminiResult && geminiResult.keywords) {
        enhancedKeywords = [...new Set([...keywords, ...geminiResult.keywords])];
    }
    if (geminiResult && geminiResult.genre_override && !filters.genre) {
        const genreName = String(geminiResult.genre_override).toLowerCase();
        for (const [keyword, id] of Object.entries(genreMap)) {
            if (genreName.includes(keyword)) {
                filters.genre = id;
                break;
            }
        }
    }
    return {
        enhancedKeywords,
        searchMood: geminiResult ? (geminiResult.mood || null) : null,
        searchContext: geminiResult ? (geminiResult.context || null) : null,
        searchSpecifics: geminiResult ? (geminiResult.specifics || []) : []
    };
}

async function enrichWithMoodAndSpecifics(movies, hints, tmdbLang) {
    const finalMovies = [...movies];
    const seenIds = new Set(finalMovies.map(m => m.id));
    const pushUnique = (list) => {
        for (const movie of list || []) {
            if (!seenIds.has(movie.id)) {
                seenIds.add(movie.id);
                finalMovies.push(toMovieCard(movie));
            }
        }
    };

    if (hints.searchMood && movies.length < 10) {
        try {
            const keywordIds = moodKeywordIds(hints.searchMood);
            if (keywordIds.length > 0) {
                const data = await tmdbGet('/discover/movie', {
                    language: tmdbLang,
                    page: 1,
                    with_keywords: keywordIds.join(','),
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 10
                });
                pushUnique(data.results);
            }
        } catch (e) {
            console.error('Mood search error:', e.message);
        }
    }

    if (hints.searchContext && finalMovies.length < 15) {
        try {
            const data = await tmdbGet('/search/movie', {
                language: tmdbLang,
                page: 1,
                query: hints.searchContext,
                sort_by: 'popularity.desc',
                'vote_count.gte': 5
            });
            pushUnique(data.results);
        } catch (e) {
            console.error('Context search error:', e.message);
        }
    }

    if (hints.searchSpecifics.length > 0 && finalMovies.length < 15) {
        for (const specific of hints.searchSpecifics) {
            try {
                const data = await tmdbGet('/search/movie', {
                    language: tmdbLang,
                    page: 1,
                    query: specific,
                    sort_by: 'popularity.desc',
                    'vote_count.gte': 5
                });
                pushUnique(data.results);
            } catch (e) {
                console.error('Specific search error:', e.message);
            }
        }
    }
    return finalMovies;
}

async function buildRecommendPayloadFromQuery(finalMovies, q, pageNum, tmdbLang) {
    if (finalMovies.length > 0) {
        return {
            page: pageNum,
            total_pages: Math.max(1, Math.ceil(finalMovies.length / 20)),
            results: finalMovies
        };
    }
    const data = await tmdbGet('/search/movie', { language: tmdbLang, page: pageNum, query: q.trim().substring(0, 40) });
    return {
        page: pageNum,
        total_pages: 1,
        results: (data.results || []).slice(0, 20).map(m => toMovieCard(m))
    };
}

async function sendFallbackResults(q, tmdbLang, pageNum, cacheKey, res, error) {
    console.error('Search error:', error.message);
    try {
        const data = await tmdbGet('/search/movie', { language: tmdbLang, page: pageNum, query: q });
        const fallback = {
            page: pageNum,
            total_pages: 1,
            results: (data.results || []).slice(0, 20).map(m => toMovieCard(m))
        };
        setCachedResult(cacheKey, fallback);
        res.json(fallback);
    } catch (e2) {
        res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
}
