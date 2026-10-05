const { checkFreeStreaming } = require('../lib/free-streaming');

module.exports = async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://cineworld-site.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { createLimiter } = require('../lib/rate-limit');
    const checkRate = createLimiter({ limit: 120, message: 'Muitas requisicoes. Tente novamente em instantes.' });
    if (!checkRate(req, res)) return;

    const movieId = req.query.id;
    const language = req.query.language || 'pt-BR';

    if (!movieId) {
        return res.status(400).json({ error: 'ID do filme é obrigatório' });
    }

    try {
        const apiKey = process.env.TMDB_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'TMDB_API_KEY não configurada' });
        }

        const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}&language=${language}`;
        const response = await fetch(url);
        const data = await response.json();

        let streaming = [];

        // Função para adicionar provedores com tipo
        const addProviders = (list, type) => {
            if (list && Array.isArray(list)) {
                list.forEach(p => {
                    // Só gratuito se for streaming (flatrate)
                    const isFree = type === 'flatrate' && checkFreeStreaming(p.provider_name);
                    streaming.push({
                        name: p.provider_name,
                        logo: p.logo_path ? 'https://image.tmdb.org/t/p/w92' + p.logo_path : null,
                        type: type,
                        isFree: isFree,
                        link: getPlatformLink(p.provider_name, data.id || movieId)
                    });
                });
            }
        };

        // BR
        if (data.results && data.results.BR) {
            addProviders(data.results.BR.flatrate, 'flatrate');
            addProviders(data.results.BR.rent, 'rent');
            addProviders(data.results.BR.buy, 'buy');
            addProviders(data.results.BR.ads, 'ads');
        }
        // US fallback
        if (data.results && data.results.US && streaming.length === 0) {
            addProviders(data.results.US.flatrate, 'flatrate');
            addProviders(data.results.US.rent, 'rent');
            addProviders(data.results.US.buy, 'buy');
            addProviders(data.results.US.ads, 'ads');
        }

        return res.status(200).json({
            id: movieId,
            streaming: streaming
        });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar plataformas' });
    }
};

// Mapa simplificado de links (mantido)
function getPlatformLink(platformName, movieTitle) {
    const links = {
        'Netflix': 'https://www.netflix.com',
        'Prime Video': 'https://www.primevideo.com',
        'Amazon Prime Video': 'https://www.primevideo.com',
        'Disney+': 'https://www.disneyplus.com',
        'Disney Plus': 'https://www.disneyplus.com',
        'Max': 'https://www.max.com',
        'HBO Max': 'https://www.max.com',
        'Apple TV': 'https://tv.apple.com',
        'Apple TV+': 'https://tv.apple.com',
        'Paramount+': 'https://www.paramountplus.com',
        'Paramount Plus': 'https://www.paramountplus.com',
        'Globoplay': 'https://globoplay.globo.com',
        'Star+': 'https://www.starplus.com',
        'Star Plus': 'https://www.starplus.com',
        'Lionsgate+': 'https://www.lionsgateplus.com',
        'Mubi': 'https://mubi.com',
        'Looke': 'https://www.looke.com.br',
        'O2 Filmes': 'https://www.o2filmes.com.br',
        'Vix': 'https://vix.com',
        'Claro Video': 'https://www.clarovideo.com',
        'NOW': 'https://www.clarovideo.com',
        'Telecine': 'https://www.telecine.com.br',
        'HBO Go': 'https://www.hbogo.com.br',
        'Tubi': 'https://tubitv.com',
        'Pluto TV': 'https://pluto.tv',
        'Peacock': 'https://www.peacocktv.com',
        'Crackle': 'https://www.crackle.com',
        'Freevee': 'https://www.freevee.com',
        'YouTube': 'https://www.youtube.com',
        'Rakuten': 'https://www.rakuten.tv',
        'Kanopy': 'https://www.kanopy.com',
        'Xumo': 'https://www.xumo.com',
        'Plex': 'https://watch.plex.tv',
        'Hoopla': 'https://www.hoopladigital.com'
    };
    return links[platformName] || '#';
}