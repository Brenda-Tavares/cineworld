// CineWorld - Main Script

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ========================================
// STATE
// ========================================
let state = {
    movies: [],
    currentPage: 1,
    totalPages: 1,
    currentGenre: '0',
    currentSort: 'popularity',
    currentOrigin: 'all',
    currentLanguage: 'pt-BR',
    currentYear: '',
    searchQuery: '',
    isLoading: false,
    genres: []
};

// ========================================
// LANGUAGE MAP
// ========================================
const languageMap = {
    'pt-BR': 'pt-BR',
    'en': 'en-US',
    'es': 'es-ES',
    'zh-CN': 'zh-CN',
    'zh-HK': 'zh-TW',
    'ja': 'ja-JP',
    'ru': 'ru-RU',
    'ko': 'ko-KR'
};

// ========================================
// TRANSLATIONS
// ========================================
const translations = {
    'pt-BR': {
        searchPlaceholder: 'Buscar filmes...',
        popular: 'Populares', bestRated: 'Melhores Avaliados', worstRated: 'Piores Avaliados', release: 'Lançamentos', upcoming: 'Próximos Lançamentos',
        all: 'Todos', national: 'Nacionais', international: 'Internacionais', originLabel: 'Filmes:',
        allYears: 'Todos', genres: 'Gêneros', movies: 'filmes', page: 'Página', of: 'de',
        language: 'Idioma',
        prev: 'Anterior', next: 'Próxima', details: 'Detalhes',
        rating: 'Avaliação', year: 'Ano', synopsis: 'Sinopse', synopsisNotAvailable: 'Sinopse não disponível.',
        originalTitle: 'Título original', close: 'Fechar',
        noResults: 'Nenhum filme encontrado', tryAgain: 'Tente outro gênero ou busca', resultsFor: 'Resultados para',
        streaming: 'Onde Assistir', runtime: 'min',
        sortBy: 'Ordenar',
        footer: '© 2026 - Todos os direitos reservados | Desenvolvido por',
        tagline: 'Descubra filmes e onde assistir',
        about: 'Sobre', privacy: 'Privacidade', terms: 'Termos', cookies: 'Cookies',
        watch: 'Assistir', rent: 'Alugar', buy: 'Comprar',
        navHome: 'Início', navAbout: 'Sobre', navPrivacy: 'Privacidade', navTerms: 'Termos', navCookies: 'Cookies',
        footerAbout: 'Sobre', footerPrivacy: 'Privacidade', footerTerms: 'Termos', footerCookies: 'Cookies',
        watchTrailer: 'Ver Trailer',
        aiTitle: 'O que deseja assistir?', aiGreeting: 'Olá! Sou a assistente de filmes do CineWorld.', aiDescribe: 'Descreva o que você quer assistir:', aiExample: 'Ex: "filme de ação com robôs", "comédia romântica indiana"', aiPlaceholder: 'Descreva o filme...',
        noTitle: 'Sem título',
        searching: 'Buscando',
        analyzing: 'Analisando',
        error: 'Erro ao buscar',
        emptyTitle: 'Nenhum filme encontrado',
        emptyDesc: 'Tente outro gênero, ajuste os filtros ou use a busca para encontrar algo diferente.',
        skipToContent: 'Pular para o conteúdo',
        enterPage: 'Ir para página',
    },
    'en': {
        searchPlaceholder: 'Search movies...',
        popular: 'Popular', bestRated: 'Top Rated', worstRated: 'Lowest Rated', release: 'New Releases', upcoming: 'Upcoming Releases',
        all: 'All', allYears: 'All', national: 'National', international: 'International', originLabel: 'Movies:',
        genres: 'Genres', movies: 'movies', page: 'Page', of: 'of',
        language: 'Language',
        prev: 'Previous', next: 'Next', details: 'Details',
        rating: 'Rating', year: 'Year', synopsis: 'Synopsis', synopsisNotAvailable: 'Synopsis not available',
        originalTitle: 'Original title', close: 'Close',
        noResults: 'No movies found', tryAgain: 'Try another genre or search', resultsFor: 'Results for',
        streaming: 'Watch On', runtime: 'min',
        sortBy: 'Sort',
        footer: '© 2026 - All rights reserved | Developed by',
        tagline: 'Discover movies and where to watch',
        about: 'About', privacy: 'Privacy', terms: 'Terms', cookies: 'Cookies',
        watch: 'Watch', rent: 'Rent', buy: 'Buy',
        navHome: 'Home', navAbout: 'About', navPrivacy: 'Privacy', navTerms: 'Terms', navCookies: 'Cookies',
        footerAbout: 'About', footerPrivacy: 'Privacy', footerTerms: 'Terms', footerCookies: 'Cookies',
        watchTrailer: 'Watch Trailer',
        aiTitle: 'What would you like to watch?', aiGreeting: 'Hello! I am the CineWorld movie assistant.', aiDescribe: 'Describe what you want to watch:', aiExample: 'Ex: "action movie with robots", "Indian romantic comedy"', aiPlaceholder: 'Describe the movie...',
        noTitle: 'No Title',
        searching: 'Searching',
        analyzing: 'Analyzing',
        error: 'Search error',
        emptyTitle: 'No movies found',
        emptyDesc: 'Try another genre, adjust filters, or use search to find something different.',
        skipToContent: 'Skip to content',
        enterPage: 'Go to page',
    },
    'es': {
        searchPlaceholder: 'Buscar películas...',
        popular: 'Películas Populares', bestRated: 'Mejor Valoradas', worstRated: 'Peor Valoradas', release: 'Estrenos', upcoming: 'Próximos Estrenos',
        all: 'Todos', allYears: 'Todos', national: 'Nacionales', international: 'Internacionales', originLabel: 'Películas:',
        genres: 'Géneros', movies: 'películas', page: 'Página', of: 'de',
        language: 'Idioma',
        prev: 'Anterior', next: 'Siguiente', details: 'Detalles',
        rating: 'Valoración', year: 'Año', synopsis: 'Sinopsis', synopsisNotAvailable: 'Sinopsis no disponible.',
        originalTitle: 'Título original', close: 'Cerrar',
        noResults: 'No se encontraron películas', tryAgain: 'Intenta otro género o búsqueda', resultsFor: 'Resultados para',
        streaming: 'Ver en', runtime: 'min',
        sortBy: 'Ordenar',
        footer: '© 2026 - Todos los derechos reservados | Desarrollado por',
        tagline: 'Descubre películas y dónde verlas',
        about: 'Sobre', privacy: 'Privacidad', terms: 'Términos', cookies: 'Cookies',
        watch: 'Ver', rent: 'Alquilar', buy: 'Comprar',
        navHome: 'Inicio', navAbout: 'Acerca de', navPrivacy: 'Privacidad', navTerms: 'Términos', navCookies: 'Cookies',
        footerAbout: 'Acerca de', footerPrivacy: 'Privacidad', footerTerms: 'Términos', footerCookies: 'Cookies',
        watchTrailer: 'Ver Trailer',
        aiTitle: '¿Qué quieres ver?', aiGreeting: '¡Hola! Soy el asistente de películas de CineWorld.', aiDescribe: 'Describe lo que quieres ver:', aiExample: 'Ej: "película de acción con robots"', aiPlaceholder: 'Describe la película...',
        noTitle: 'Sin título',
        searching: 'Buscando',
        analyzing: 'Analizando',
        error: 'Error de búsqueda',
        emptyTitle: 'No se encontraron películas',
        emptyDesc: 'Intenta otro género, ajusta los filtros o usa la búsqueda para encontrar algo diferente.',
        skipToContent: 'Saltar al contenido',
        enterPage: 'Ir a página',
    },
    'zh-CN': {
        searchPlaceholder: '搜索电影...',
        popular: '热门电影', bestRated: '评分最高', worstRated: '评分最低', release: '最新', upcoming: '即将上映',
        all: '全部', allYears: '全部', national: '国产', international: '国际', originLabel: '电影:',
        genres: '类型', movies: '部电影', page: '第', of: '页，共',
        language: '语言',
        prev: '上一页', next: '下一页', details: '详情',
        rating: '评分', year: '年份', synopsis: '简介', synopsisNotAvailable: '简介不可用',
        originalTitle: '原名', close: '关闭',
        noResults: '未找到电影', tryAgain: '尝试其他类型或搜索', resultsFor: '搜索结果',
        streaming: '在线观看', runtime: '分钟',
        sortBy: '排序',
        footer: '© 2026 - 版权所有 | 开发',
        tagline: '发现电影和在哪里观看',
        about: '关于', privacy: '隐私', terms: '条款', cookies: 'Cookies',
        watch: '观看', rent: '租借', buy: '购买',
        navHome: '首页', navAbout: '关于', navPrivacy: '隐私', navTerms: '条款', navCookies: 'Cookies',
        footerAbout: '关于', footerPrivacy: '隐私', footerTerms: '条款', footerCookies: 'Cookies',
        watchTrailer: '观看预告片',
        aiTitle: '想看什么?', aiGreeting: '你好！我是 CineWorld 电影助手。', aiDescribe: '描述你想看什么:', aiExample: '例如："机器人动作片"', aiPlaceholder: '描述电影...',
        noTitle: '无标题',
        searching: '搜索中',
        analyzing: '分析中',
        error: '搜索错误',
        emptyTitle: '未找到电影',
        emptyDesc: '尝试其他类型，调整筛选条件，或使用搜索查找不同的内容。',
        skipToContent: '跳到内容',
        enterPage: '转到页面',
    },
    'zh-HK': {
        searchPlaceholder: '搜尋電影...',
        popular: '熱門電影', bestRated: '評分最高', worstRated: '評分最低', release: '最新', upcoming: '即將上映',
        all: '全部', allYears: '全部', national: '本土', international: '國際', originLabel: '電影:',
        genres: '類型', movies: '部電影', page: '第', of: '頁，共',
        language: '語言',
        prev: '上一頁', next: '下一頁', details: '詳情',
        rating: '評分', year: '年份', synopsis: '簡介', synopsisNotAvailable: '簡介不可用',
        originalTitle: '原名', close: '關閉',
        noResults: '未找到電影', tryAgain: '嘗試其他類型或搜尋', resultsFor: '搜尋結果',
        streaming: '線上觀看', runtime: '分鐘',
        sortBy: '排序',
        footer: '© 2026 - 版權所有 | 開發',
        tagline: '發現電影和在哪裡觀看',
        about: '關於', privacy: '隱私', terms: '條款', cookies: 'Cookies',
        watch: '觀看', rent: '租用', buy: '購買',
        navHome: '首頁', navAbout: '關於', navPrivacy: '隱私', navTerms: '條款', navCookies: 'Cookies',
        footerAbout: '關於', footerPrivacy: '隱私', footerTerms: '條款', footerCookies: 'Cookies',
        watchTrailer: '觀看預告片',
        aiTitle: '想睇咩?', aiGreeting: '你好！我是 CineWorld 電影助手。', aiDescribe: '描述你想睇咩:', aiExample: '例如："機器人動作片"', aiPlaceholder: '描述電影...',
        noTitle: '無標題',
        searching: '搜尋中',
        analyzing: '分析中',
        error: '搜尋錯誤',
        emptyTitle: '未找到電影',
        emptyDesc: '嘗試其他類型，調整篩選條件，或使用搜尋查找不同的內容。',
        skipToContent: '跳到內容',
        enterPage: '轉到頁面',
    },
    'ja': {
        searchPlaceholder: '映画を検索...',
        popular: '人気映画', bestRated: '高評価', worstRated: '低評価', release: '最新作', upcoming: '公開予定',
        all: 'すべて', allYears: 'すべて', national: '日本', international: '外国', originLabel: '映画:',
        genres: 'ジャンル', movies: '映画', page: 'ページ', of: '/',
        language: '言語',
        prev: '前へ', next: '次へ', details: '詳細',
        rating: '評価', year: '年', synopsis: 'あらすじ', synopsisNotAvailable: 'あらすじはありません',
        originalTitle: '原題', close: '閉じる',
        noResults: '映画が見つかりません', tryAgain: '他のジャンルで検索', resultsFor: '検索結果',
        streaming: '視聴', runtime: '分',
        sortBy: '並べ替え',
        footer: '© 2026 - 全著作権 | 開発',
        tagline: '映画を見つけて、視聴方法を確認',
        about: 'について', privacy: 'プライバシー', terms: '利用規約', cookies: 'Cookies',
        watch: '視聴', rent: 'レンタル', buy: '購入',
        navHome: 'ホーム', navAbout: 'について', navPrivacy: 'プライバシー', navTerms: '利用規約', navCookies: 'Cookies',
        footerAbout: 'について', footerPrivacy: 'プライバシー', footerTerms: '利用規約', footerCookies: 'Cookies',
        watchTrailer: '予告編を見る',
        aiTitle: '何を見たいですか？', aiGreeting: 'こんにちは！CineWorld 映画アシスタントです。', aiDescribe: '見たいものを教えてください:', aiExample: '例："ロボットアクション映画"', aiPlaceholder: '映画を説明...',
        noTitle: '無題',
        searching: '検索中',
        analyzing: '分析中',
        error: '検索エラー',
        emptyTitle: '映画が見つかりません',
        emptyDesc: '他のジャンルを試すか、フィルターを調整するか、検索で別のものを見つけてください。',
        skipToContent: 'コンテンツへスキップ',
        enterPage: 'ページへ移動',
    },
    'ru': {
        searchPlaceholder: 'Поиск фильмов...',
        popular: 'Популярные фильмы', bestRated: 'Лучшие оценки', worstRated: 'Худшие оценки', release: 'Новейшие', upcoming: 'Скоро в прокате',
        all: 'Все', allYears: 'Все', national: 'Национальные', international: 'Международные', originLabel: 'Фильмы:',
        genres: 'Жанры', movies: 'фильмов', page: 'Страница', of: 'из',
        language: 'Язык',
        prev: 'Предыдущая', next: 'Следующая', details: 'Детали',
        rating: 'Рейтинг', year: 'Год', synopsis: 'Описание', synopsisNotAvailable: 'Описание недоступно',
        originalTitle: 'Оригинальное название', close: 'Закрыть',
        noResults: 'Фильмы не найдены', tryAgain: 'Попробуйте другой жанр или поиск', resultsFor: 'Результаты для',
        streaming: 'Смотреть', runtime: 'мин',
        sortBy: 'Сортировать',
        footer: '© 2026 - Все права защищены | Разработано',
        tagline: 'Найдите фильмы и где смотреть',
        about: 'О нас', privacy: 'Конфиденциальность', terms: 'Условия', cookies: 'Cookies',
        watch: 'Смотреть', rent: 'Аренда', buy: 'Купить',
        navHome: 'Главная', navAbout: 'О нас', navPrivacy: 'Конфиденциальность', navTerms: 'Условия', navCookies: 'Cookies',
        footerAbout: 'О нас', footerPrivacy: 'Конфиденциальность', footerTerms: 'Условия', footerCookies: 'Cookies',
        watchTrailer: 'Смотреть трейлер',
        aiTitle: 'Что хотите смотреть?', aiGreeting: 'Привет! Я помощник фильмов CineWorld.', aiDescribe: 'Опишите, что хотите смотреть:', aiExample: 'Например: "боевик с роботами"', aiPlaceholder: 'Опишите фильм...',
        noTitle: 'Без названия',
        searching: 'Поиск',
        analyzing: 'Анализ',
        error: 'Ошибка поиска',
        emptyTitle: 'Фильмы не найдены',
        emptyDesc: 'Попробуйте другой жанр, настройте фильтры или используйте поиск чтобы найти что-то другое.',
        skipToContent: 'Перейти к содержанию',
        enterPage: 'Перейти на страницу',
    },
    'ko': {
        searchPlaceholder: '영화 검색...',
        popular: '인기 영화', bestRated: '높은 평점', worstRated: '낮은 평점', release: '최신', upcoming: '개봉 예정',
        all: '전체', allYears: '전체', national: '국내', international: '해외', originLabel: '영화:',
        genres: '장르', movies: '편', page: '페이지', of: '/',
        language: '언어',
        prev: '이전', next: '다음', details: '상세정보',
        rating: '평점', year: '연도', synopsis: '시놉시스', synopsisNotAvailable: '시놉시스 없음',
        originalTitle: '원제', close: '닫기',
        noResults: '영화를 찾을 수 없습니다', tryAgain: '다른 장르 또는 검색을 시도하세요', resultsFor: '검색 결과',
        streaming: '시청', runtime: '분',
        sortBy: '정렬',
        footer: '© 2026 - 모든 권리 보유 | 개발',
        tagline: '영화 찾기 및 시청 방법',
        about: '정보', privacy: '개인정보', terms: '이용약관', cookies: 'Cookies',
        watch: '시청', rent: '대여', buy: '구매',
        navHome: '홈', navAbout: '정보', navPrivacy: '개인정보', navTerms: '이용약관', navCookies: 'Cookies',
        footerAbout: '정보', footerPrivacy: '개인정보', footerTerms: '이용약관', footerCookies: 'Cookies',
        watchTrailer: '예고편 보기',
        aiTitle: '무엇을 보고 싶나요?', aiGreeting: '안녕하세요! CineWorld 영화 도우미입니다.', aiDescribe: '보고 싶은 것을 설명:', aiExample: '예: "로봇 액션 영화"', aiPlaceholder: '영화 설명...',
        noTitle: '제목 없음',
        searching: '검색 중',
        analyzing: '분석 중',
        error: '검색 오류',
        emptyTitle: '영화를 찾을 수 없습니다',
        emptyDesc: '다른 장르를 시도하거나, 필터를 조정하거나, 검색을 사용하여 다른 것을 찾아보세요.',
        skipToContent: '콘텐츠로 건너뛰기',
        enterPage: '페이지로 이동',
    }
};

// Translation function
function t(key) {
    const lang = translations[state.currentLanguage] || translations['pt-BR'];
    return lang[key] || translations['pt-BR'][key] || key;
}

// ========================================
// API
// ========================================
const API_BASE = '/api';

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    try {
        loadFromURL();
    } catch(e) {
        console.error('loadFromURL error:', e);
    }
    try {
        setupEvents();
    } catch(e) {
        console.error('setupEvents error:', e);
    }
    try {
        updateNavLinks();
    } catch(e) {
        console.error('updateNavLinks error:', e);
    }
    try {
        applyTranslations();
    } catch(e) {
        console.error('applyTranslations error:', e);
    }
    loadData();
    
    // Always hide loading after timeout, regardless of errors
    setTimeout(() => {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) loadingEl.style.display = 'none';
    }, 1500);
});

// ========================================
// URL STATE
// ========================================
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('page')) state.currentPage = parseInt(params.get('page')) || 1;
    if (params.has('sort')) state.currentSort = params.get('sort');
    if (params.has('genre')) state.currentGenre = params.get('genre');
    if (params.has('origin')) state.currentOrigin = params.get('origin');
    if (params.has('year')) state.currentYear = params.get('year');
    
    if (params.has('lang')) {
        state.currentLanguage = params.get('lang');
        localStorage.setItem('cineworld_language', state.currentLanguage);
    } else {
        const savedLang = localStorage.getItem('cineworld_language');
        if (savedLang) state.currentLanguage = savedLang;
    }
    
    if (params.has('q')) {
        state.searchQuery = params.get('q');
        const searchInput = document.getElementById('mainSearchInput');
        if (searchInput) searchInput.value = state.searchQuery;
    }
    
    // Sync UI with state
    // Sync custom lang dropdown
    updateLangDropdownUI();
    
    const genreSelect = document.getElementById('genreSelectMobile');
    if (genreSelect) genreSelect.value = state.currentGenre;
    
    const originSelect = document.getElementById('filterOriginSelect');
    if (originSelect) originSelect.value = state.currentOrigin;
    
    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) sortSelect.value = state.currentSort;
    
    const yearSelect = document.getElementById('filterYearSelect');
    if (yearSelect) yearSelect.value = state.currentYear;
}

// ========================================
// EVENT SETUP
// ========================================
function setupEvents() {
    // Search
    const searchBtn = document.getElementById('mainSearchBtn');
    const searchInput = document.getElementById('mainSearchInput');
    
    if (searchBtn) searchBtn.addEventListener('click', performMainSearch);
    if (searchInput) searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') performMainSearch(); });
    
    // Language
    // Language dropdown
    setupLangDropdown();
    
    // Filters
    const originSelect = document.getElementById('filterOriginSelect');
    if (originSelect) originSelect.addEventListener('change', function() {
        state.currentOrigin = this.value;
        state.currentPage = 1;
        loadMovies();
    });
    
    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) sortSelect.addEventListener('change', function() {
        state.currentSort = this.value;
        state.currentPage = 1;
        loadMovies();
    });
    
    const yearSelect = document.getElementById('filterYearSelect');
    if (yearSelect) yearSelect.addEventListener('change', function() {
        state.currentYear = this.value;
        state.currentPage = 1;
        loadMovies();
    });
    
    // Genre mobile
    const genreMobile = document.getElementById('genreSelectMobile');
    if (genreMobile) genreMobile.addEventListener('change', function() {
        state.currentGenre = this.value;
        state.currentPage = 1;
        state.searchQuery = '';
        const searchInput = document.getElementById('mainSearchInput');
        if (searchInput) searchInput.value = '';
        updateTitle();
        loadMovies();
    });
    
    // Pagination
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (state.currentPage > 1) { state.currentPage--; loadMovies(); }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (state.currentPage < state.totalPages) { state.currentPage++; loadMovies(); }
    });
    
    // Modal close
    const modal = document.getElementById('movieModal');
    if (modal) modal.addEventListener('click', function(e) {
        if (e.target === this) closeMovieModal();
    });
    
    // ESC key
    document.addEventListener('keydown', handleGlobalKeydown);
}

// ========================================
// KEYBOARD HANDLING
// ========================================
function handleGlobalKeydown(e) {
    if (e.key === 'Escape') {
        const langPanel = document.getElementById('langDropdownPanel');
        if (langPanel && langPanel.classList.contains('open')) {
            closeLangDropdown();
            return;
        }
        const modal = document.getElementById('movieModal');
        if (modal.classList.contains('open')) {
            closeMovieModal();
            return;
        }
        const aiPanel = document.getElementById('aiPanel');
        if (aiPanel && aiPanel.classList.contains('open')) {
            toggleAIPanel();
            return;
        }
    }
}

// ========================================
// LANGUAGE DROPDOWN (CUSTOM)
// ========================================
const langMeta = {
    'pt-BR': { name: 'Português', native: 'Português' },
    'en': { name: 'Inglês', native: 'English' },
    'es': { name: 'Espanhol', native: 'Español' },
    'zh-CN': { name: 'Mandarim', native: '中文' },
    'zh-HK': { name: 'Cantonês', native: '廣東話' },
    'ja': { name: 'Japonês', native: '日本語' },
    'ru': { name: 'Russo', native: 'Русский' },
    'ko': { name: 'Coreano', native: '한국어' }
};

function setupLangDropdown() {
    const btn = document.getElementById('langDropdownBtn');
    const panel = document.getElementById('langDropdownPanel');
    if (!btn || !panel) return;
    
    // Toggle dropdown
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = panel.classList.contains('open');
        if (isOpen) {
            closeLangDropdown();
        } else {
            openLangDropdown();
        }
    });
    
    // Item clicks
    panel.querySelectorAll('.lang-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.dataset.lang;
            if (lang && lang !== state.currentLanguage) {
                state.currentLanguage = lang;
                state.currentPage = 1;
                localStorage.setItem('cineworld_language', lang);
                document.getElementById('htmlLang').lang = lang;
                updateLangDropdownUI();
                applyTranslations();
                updateNavLinks();
                updateURL();
                closeLangDropdown();
                window.location.href = window.location.pathname + '?lang=' + lang;
            } else {
                closeLangDropdown();
            }
        });
        
        // Keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-dropdown')) {
            closeLangDropdown();
        }
    });
}

function openLangDropdown() {
    const btn = document.getElementById('langDropdownBtn');
    const panel = document.getElementById('langDropdownPanel');
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    
    // Focus active item
    const active = panel.querySelector('.lang-dropdown-item.active');
    if (active) setTimeout(() => active.focus(), 50);
}

function closeLangDropdown() {
    const btn = document.getElementById('langDropdownBtn');
    const panel = document.getElementById('langDropdownPanel');
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
}

function updateLangDropdownUI() {
    const meta = langMeta[state.currentLanguage] || langMeta['pt-BR'];
    
    const nameEl = document.getElementById('currentLangName');
    if (nameEl) nameEl.textContent = meta.name;
    
    // Update active state in panel
    document.querySelectorAll('.lang-dropdown-item').forEach(item => {
        const isActive = item.dataset.lang === state.currentLanguage;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive.toString());
    });
}

// ========================================
// MODAL FOCUS TRAP (WCAG 2.4.3)
// ========================================
let lastFocusedElement = null;

function trapFocus(modal) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modal.querySelectorAll(focusableSelectors);
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function modalTrap(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
        
        // Re-check if modal is still open
        if (!modal.classList.contains('open')) {
            modal.removeEventListener('keydown', modalTrap);
        }
    });
}

// ========================================
// DATA LOADING
// ========================================
async function loadData() {
    try {
        const tmdbLang = languageMap[state.currentLanguage] || 'pt-BR';
        const genresRes = await fetch(API_BASE + '/genres?language=' + tmdbLang);
        const genresData = await genresRes.json();
        
        if (Array.isArray(genresData)) {
            state.genres = genresData;
            renderGenres();
            updateGenreUIFromState();
        }
        
        await loadMovies();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ========================================
// GENRES
// ========================================
function renderGenres() {
    const container = document.getElementById('genresList');
    if (!container) return;
    
    let html = `
        <div class="genre-item ${state.currentGenre === '0' ? 'active' : ''}" data-id="0" role="option" tabindex="0" aria-selected="${state.currentGenre === '0'}">
            <i class="fas fa-globe" aria-hidden="true"></i>
            <span>${t('all')}</span>
        </div>
    `;
    
    html += state.genres.map(genre => `
        <div class="genre-item ${genre.id.toString() === state.currentGenre ? 'active' : ''}" data-id="${genre.id}" role="option" tabindex="0" aria-selected="${genre.id.toString() === state.currentGenre}">
            <i class="${genre.icon || 'fas fa-film'}" aria-hidden="true"></i>
            <span>${genre.name}</span>
        </div>
    `).join('');
    
    container.innerHTML = html;
    
    // Mobile select
    const mobileSelect = document.getElementById('genreSelectMobile');
    if (mobileSelect) {
        let options = `<option value="0">${t('all')} ${t('genres')}</option>`;
        options += state.genres.map(genre => 
            `<option value="${genre.id}" ${genre.id.toString() === state.currentGenre ? 'selected' : ''}>${genre.name}</option>`
        ).join('');
        mobileSelect.innerHTML = options;
    }
    
    // Desktop click handlers
    container.querySelectorAll('.genre-item').forEach(item => {
        const handler = () => {
            state.currentGenre = item.dataset.id;
            state.currentPage = 1;
            state.searchQuery = '';
            document.getElementById('mainSearchInput').value = '';
            
            container.querySelectorAll('.genre-item').forEach(g => {
                g.classList.remove('active');
                g.setAttribute('aria-selected', 'false');
            });
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');
            
            updateTitle();
            loadMovies();
        };
        
        item.addEventListener('click', handler);
        item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
    });
}

function updateGenreUIFromState() {
    document.querySelectorAll('.genre-item').forEach(item => {
        const isActive = item.dataset.id === state.currentGenre;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive.toString());
    });
}

// ========================================
// SKELETON LOADING
// ========================================
function showSkeletonLoading() {
    const container = document.getElementById('moviesGrid');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < 12; i++) {
        html += `
            <div class="skeleton-card">
                <div class="skeleton-poster"></div>
                <div class="skeleton-info">
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ========================================
// LOAD MOVIES
// ========================================
async function loadMovies() {
    if (state.isLoading) return;
    state.isLoading = true;
    
    showSkeletonLoading();
    
    try {
        const tmdbLang = languageMap[state.currentLanguage] || 'pt-BR';
        let url = API_BASE + '/movies?page=' + state.currentPage + '&sort=' + state.currentSort + '&language=' + tmdbLang;
        
        if (state.searchQuery) {
            url = API_BASE + '/movies?q=' + encodeURIComponent(state.searchQuery) + '&page=' + state.currentPage + '&language=' + tmdbLang;
        } else {
            if (state.currentGenre !== '0') url += '&genre=' + state.currentGenre;
            if (state.currentOrigin !== 'all') url += '&origin=' + state.currentOrigin;
            if (state.currentYear) url += '&year=' + state.currentYear;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            state.movies = data.results;
            state.totalPages = Math.min(data.total_pages || 1, 500);
            renderMovies();
            updateUI();
        } else {
            renderEmptyState();
        }
    } catch (error) {
        console.error('Error loading movies:', error);
        renderEmptyState();
    } finally {
        state.isLoading = false;
    }
}

// ========================================
// EMPTY STATE
// ========================================
function renderEmptyState() {
    const container = document.getElementById('moviesGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-film" aria-hidden="true"></i></div>
            <h3 class="empty-state-title">${t('emptyTitle')}</h3>
            <p class="empty-state-desc">${t('emptyDesc')}</p>
        </div>
    `;
    
    document.getElementById('moviesCount').textContent = '0 ' + t('movies');
    renderPageNumbers();
    document.getElementById('pageIndicator').textContent = '';
    document.getElementById('prevPage').disabled = true;
    document.getElementById('nextPage').disabled = true;
}

// ========================================
// RENDER MOVIES
// ========================================
function renderMovies() {
    const container = document.getElementById('moviesGrid');
    if (!container) return;
    
    if (state.movies.length === 0) {
        renderEmptyState();
        return;
    }
    
    container.innerHTML = state.movies.map((movie, index) => {
        const year = movie.release_date ? movie.release_date.split('-')[0] : '';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '';
        const posterUrl = movie.poster_path ? (movie.poster_path.startsWith('http') ? movie.poster_path : 'https://image.tmdb.org/t/p/w500' + movie.poster_path) : null;
        const hasVotes = movie.vote_count > 0;
        
        return `
            <div class="movie-card" role="listitem" tabindex="0" 
                 onclick="showMovieDetails(${movie.id})" 
                 onkeydown="if(event.key==='Enter')showMovieDetails(${movie.id})"
                 aria-label="${movie.title || t('noTitle')}${hasVotes && rating ? ', Avaliação ' + rating : ''}${year ? ', ' + year : ''}">
                <div class="movie-poster">
                    ${posterUrl ? 
                        `<img src="${posterUrl}" alt="${movie.title || t('noTitle')}" loading="lazy">` :
                        `<div class="poster-placeholder" aria-hidden="true"><i class="fas fa-film"></i></div>`
                    }
                    ${hasVotes && rating ? `<div class="movie-rating" aria-label="Avaliação ${rating}"><i class="fas fa-star" aria-hidden="true"></i> ${rating}</div>` : ''}
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title || t('noTitle')}</h3>
                    <div class="movie-meta">
                        ${year ? `<span class="year">${year}</span>` : ''}
                        ${movie.production_countries?.[0]?.name ? `<span>${movie.production_countries[0].name}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// UPDATE UI
// ========================================
function updateUI() {
    document.getElementById('moviesCount').textContent = state.movies.length + ' ' + t('movies');
    document.getElementById('prevPage').disabled = state.currentPage <= 1;
    document.getElementById('nextPage').disabled = state.currentPage >= state.totalPages;
    document.getElementById('pageIndicator').textContent = state.currentPage + ' / ' + state.totalPages;
    
    renderPageNumbers();
    updateTitle();
    updateTranslations();
    updateFooter();
    updateURL();
}

function renderPageNumbers() {
    const container = document.getElementById('pageNumbers');
    if (!container) return;
    
    const total = state.totalPages;
    const current = state.currentPage;
    let html = '';
    
    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="goToPage(${i})" aria-label="${t('enterPage')} ${i}" ${i === current ? 'aria-current="page"' : ''}>${i}</button>`;
        }
    } else {
        if (current <= 4) {
            for (let i = 1; i <= 5; i++) {
                html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="goToPage(${i})" aria-label="${t('enterPage')} ${i}" ${i === current ? 'aria-current="page"' : ''}>${i}</button>`;
            }
            html += '<span aria-hidden="true">...</span>';
            html += `<button class="page-btn" onclick="goToPage(${total})" aria-label="${t('enterPage')} ${total}">${total}</button>`;
        } else if (current >= total - 3) {
            html += `<button class="page-btn" onclick="goToPage(1)" aria-label="${t('enterPage')} 1">1</button>`;
            html += '<span aria-hidden="true">...</span>';
            for (let i = total - 4; i <= total; i++) {
                html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="goToPage(${i})" aria-label="${t('enterPage')} ${i}" ${i === current ? 'aria-current="page"' : ''}>${i}</button>`;
            }
        } else {
            html += `<button class="page-btn" onclick="goToPage(1)" aria-label="${t('enterPage')} 1">1</button>`;
            html += '<span aria-hidden="true">...</span>';
            for (let i = current - 1; i <= current + 1; i++) {
                html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="goToPage(${i})" aria-label="${t('enterPage')} ${i}" ${i === current ? 'aria-current="page"' : ''}>${i}</button>`;
            }
            html += '<span aria-hidden="true">...</span>';
            html += `<button class="page-btn" onclick="goToPage(${total})" aria-label="${t('enterPage')} ${total}">${total}</button>`;
        }
    }
    
    container.innerHTML = html;
}

window.goToPage = function(page) {
    state.currentPage = page;
    loadMovies();
};

// ========================================
// TRANSLATIONS UPDATE
// ========================================
function updateTranslations() {
    const setIfExists = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    
    setIfExists('siteTagline', t('tagline'));
    setIfExists('prevText', t('prev'));
    setIfExists('nextText', t('next'));
    setIfExists('navHome', t('navHome'));
    setIfExists('navAbout', t('navAbout'));
    setIfExists('navPrivacy', t('navPrivacy'));
    setIfExists('navTerms', t('navTerms'));
    setIfExists('navCookies', t('navCookies'));
    setIfExists('aiTitleText', t('aiTitle'));
    setIfExists('aiGreetingText', t('aiGreeting'));
    setIfExists('aiDescribeText', t('aiDescribe'));
    setIfExists('aiExampleText', t('aiExample'));
    setIfExists('skipLink', t('skipToContent'));
    
    const searchInput = document.getElementById('mainSearchInput');
    if (searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    const aiInput = document.getElementById('aiSearchInput');
    if (aiInput) aiInput.placeholder = t('aiPlaceholder');
    
    // Filter labels
    setIfExists('filterOriginLabel', t('originLabel') + ':');
    setIfExists('filterSortLabel', t('sortBy') + ':');
    
    // Filter options
    const originSelect = document.getElementById('filterOriginSelect');
    if (originSelect && originSelect.options.length >= 3) {
        originSelect.options[0].text = t('all');
        originSelect.options[1].text = t('national');
        originSelect.options[2].text = t('international');
    }
    
    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect && sortSelect.options.length >= 5) {
        sortSelect.options[0].text = t('popular');
        sortSelect.options[1].text = t('bestRated');
        sortSelect.options[2].text = t('worstRated');
        sortSelect.options[3].text = t('release');
        sortSelect.options[4].text = t('upcoming');
    }
    
    const yearSelect = document.getElementById('filterYearSelect');
    if (yearSelect && yearSelect.options.length > 0) {
        yearSelect.options[0].text = t('allYears');
    }
    
    setIfExists('genresTitle', t('genres'));
}

function updateFooter() {
    const setIfExists = (id, text, href) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = text;
            if (href) el.href = href;
        }
    };
    
    setIfExists('footerAbout', t('about'), getLegalPageUrl('about'));
    setIfExists('footerPrivacy', t('privacy'), getLegalPageUrl('privacy'));
    setIfExists('footerTerms', t('terms'), getLegalPageUrl('terms'));
    setIfExists('footerCookies', t('cookies'), getLegalPageUrl('cookies'));
}

function updateTitle() {
    const titleEl = document.getElementById('currentTitle');
    if (!titleEl) return;
    
    if (state.searchQuery) {
        titleEl.textContent = t('resultsFor') + ': ' + state.searchQuery;
    } else if (state.currentGenre === '0') {
        titleEl.textContent = t('popular');
    } else {
        const genre = state.genres.find(g => g.id.toString() === state.currentGenre);
        titleEl.textContent = genre ? genre.name : t('genres');
    }
}

function updateURL() {
    const params = new URLSearchParams();
    if (state.currentPage > 1) params.set('page', state.currentPage);
    if (state.currentSort !== 'popularity') params.set('sort', state.currentSort);
    if (state.currentGenre !== '0') params.set('genre', state.currentGenre);
    if (state.currentOrigin !== 'all') params.set('origin', state.currentOrigin);
    if (state.currentLanguage !== 'pt-BR') params.set('lang', state.currentLanguage);
    if (state.currentYear) params.set('year', state.currentYear);
    if (state.searchQuery) params.set('q', state.searchQuery);
    
    const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.pushState({}, '', newURL);
}

// ========================================
// LEGAL PAGES
// ========================================
const legalPagePaths = {
    'pt-BR': { about: '/sobre', privacy: '/privacidade', terms: '/termos', cookies: '/cookies' },
    'en': { about: '/en/sobre', privacy: '/en/privacidade', terms: '/en/termos', cookies: '/en/cookies' },
    'es': { about: '/es/sobre', privacy: '/es/privacidade', terms: '/es/termos', cookies: '/es/cookies' },
    'zh-CN': { about: '/zh/sobre', privacy: '/zh/privacidade', terms: '/zh/termos', cookies: '/zh/cookies' },
    'zh-HK': { about: '/zh/sobre', privacy: '/zh/privacidade', terms: '/zh/termos', cookies: '/zh/cookies' },
    'ja': { about: '/ja/sobre', privacy: '/ja/privacidade', terms: '/ja/termos', cookies: '/ja/cookies' },
    'ru': { about: '/ru/sobre', privacy: '/ru/privacidade', terms: '/ru/termos', cookies: '/ru/cookies' },
    'ko': { about: '/ko/sobre', privacy: '/ko/privacidade', terms: '/ko/termos', cookies: '/ko/cookies' }
};

function getLegalPageUrl(pageType) {
    const paths = legalPagePaths[state.currentLanguage] || legalPagePaths['pt-BR'];
    return paths[pageType] || paths.about;
}

function updateNavLinks() {
    const setLink = (id, href) => { const el = document.getElementById(id); if (el) el.href = href; };
    setLink('navAboutLink', getLegalPageUrl('about'));
    setLink('navPrivacyLink', getLegalPageUrl('privacy'));
    setLink('navTermsLink', getLegalPageUrl('terms'));
    setLink('navCookiesLink', getLegalPageUrl('cookies'));
}

function applyTranslations() {
    const lang = translations[state.currentLanguage] || translations['pt-BR'];
    if (!lang) return;
    
    const elements = {
        'siteTagline': 'tagline',
        'navHome': 'navHome',
        'navAbout': 'navAbout',
        'navPrivacy': 'navPrivacy',
        'navTerms': 'navTerms',
        'navCookies': 'navCookies',
        'footerAbout': 'footerAbout',
        'footerPrivacy': 'footerPrivacy',
        'footerTerms': 'footerTerms',
        'footerCookies': 'footerCookies'
    };
    
    for (const [id, key] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el && lang[key]) {
            const textSpan = el.querySelector('span');
            if (textSpan && lang[key]) textSpan.textContent = lang[key];
        }
    }
}

// ========================================
// SEARCH — HYBRID (Direct + AI)
// ========================================
function performMainSearch() {
    const input = document.getElementById('mainSearchInput');
    const query = input ? input.value.trim() : '';
    if (!query) return;
    
    state.searchQuery = query;
    state.currentPage = 1;
    state.currentGenre = '0';
    
    // Show loading state on button
    const btn = document.getElementById('mainSearchBtn');
    if (btn) {
        btn.classList.add('btn-loading');
        btn.innerHTML = '<i class="fas fa-spinner" aria-hidden="true"></i>';
    }
    
    updateURL();
    
    // Try direct search first via API
    const tmdbLang = languageMap[state.currentLanguage] || 'pt-BR';
    const directUrl = API_BASE + '/movies?q=' + encodeURIComponent(query) + '&page=1&language=' + tmdbLang;
    
    fetch(directUrl)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                state.movies = data.results;
                state.totalPages = Math.min(data.total_pages || 1, 500);
                renderMovies();
                updateUI();
                document.getElementById('currentTitle').textContent = t('resultsFor') + ': ' + query;
            } else {
                // Fallback to AI search
                return useAISearch(query);
            }
        })
        .catch(() => {
            // Fallback to AI search on error
            return useAISearch(query);
        })
        .finally(() => {
            if (btn) {
                btn.classList.remove('btn-loading');
                btn.innerHTML = '<i class="fas fa-search" aria-hidden="true"></i>';
            }
        });
}

async function useAISearch(query) {
    const tmdbLang = languageMap[state.currentLanguage] || 'pt-BR';
    const url = API_BASE + '/ai-search?q=' + encodeURIComponent(query) + '&page=1&language=' + tmdbLang;
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('HTTP ' + response.status);
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            state.movies = data.results;
            state.totalPages = Math.min(data.total_pages || 1, 500);
            renderMovies();
            updateUI();
            document.getElementById('currentTitle').textContent = t('resultsFor') + ': ' + query;
        } else {
            renderEmptyState();
        }
    } catch (error) {
        console.error('AI search error:', error);
        renderEmptyState();
    }
}

// ========================================
// AI PANEL
// ========================================
window.toggleAIPanel = function() {
    const panel = document.getElementById('aiPanel');
    const btn = document.getElementById('aiFloatBtn');
    const isOpen = panel.classList.toggle('open');
    
    panel.setAttribute('aria-hidden', (!isOpen).toString());
    btn.setAttribute('aria-expanded', isOpen.toString());
    
    if (isOpen) {
        document.getElementById('aiSearchInput').focus();
    }
};

function doAiSearch() {
    const input = document.getElementById('aiSearchInput');
    const query = input ? input.value.trim() : '';
    if (!query) return;
    
    const resultsDiv = document.getElementById('aiResults');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div class="ai-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ' + t('analyzing') + '...</div>';
    
    const tmdbLang = languageMap[state.currentLanguage] || 'pt-BR';
    const url = API_BASE + '/ai-search?q=' + encodeURIComponent(query) + '&page=1&language=' + tmdbLang;
    
    fetch(url).then(res => res.json()).then(data => {
        if (data.results && data.results.length > 0) {
            state.movies = data.results;
            state.totalPages = Math.min(data.total_pages || 1, 500);
            state.searchQuery = query;
            state.currentPage = 1;
            renderMovies();
            updateUI();
            document.getElementById('currentTitle').textContent = t('resultsFor') + ': ' + query;
            document.getElementById('aiPanel').classList.remove('open');
        } else {
            resultsDiv.innerHTML = '<p class="ai-no-results">' + t('noResults') + '</p>';
        }
    }).catch(err => {
        console.error('AI search error:', err);
        resultsDiv.innerHTML = '<p class="ai-error">' + t('error') + '</p>';
    });
}

window.askAI = doAiSearch;

// ========================================
// MOVIE MODAL
// ========================================
window.showMovieDetails = async function(movieId) {
    lastFocusedElement = document.activeElement;
    
    try {
        const tmdbLang = languageMap[state.currentLanguage] || 'pt-BR';
        const response = await fetch(API_BASE + '/movie?id=' + movieId + '&language=' + tmdbLang);
        const data = await response.json();
        
        if (data.movie) {
            showMovieModal(data.movie);
        } else if (data.error) {
            showToast('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading movie:', error);
        const movie = state.movies.find(m => m.id === movieId);
        if (movie) showMovieModal(movie);
    }
};

function showMovieModal(movie) {
    const modal = document.getElementById('movieModal');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    
    const year = movie.release_date ? movie.release_date.split('-')[0] : '';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '';
    const posterUrl = movie.poster_path ? movie.poster_path : null;
    const hasVotes = movie.vote_count > 0;
    
    let streamingHtml = '';
    if (movie.streaming && movie.streaming.length > 0) {
        const platformUrls = {
            'netflix': 'https://www.netflix.com',
            'netflix standard with ads': 'https://www.netflix.com',
            'amazon prime video': 'https://www.primevideo.com',
            'prime video': 'https://www.primevideo.com',
            'amazon': 'https://www.primevideo.com',
            'prime': 'https://www.primevideo.com',
            'disney+': 'https://www.disneyplus.com',
            'disney plus': 'https://www.disneyplus.com',
            'disney': 'https://www.disneyplus.com',
            'hbo max': 'https://www.max.com',
            'hbo': 'https://www.max.com',
            'max': 'https://www.max.com',
            'paramount+': 'https://www.paramountplus.com',
            'paramount plus': 'https://www.paramountplus.com',
            'paramount': 'https://www.paramountplus.com',
            'apple tv+': 'https://tv.apple.com',
            'apple tv': 'https://tv.apple.com',
            'apple': 'https://tv.apple.com',
            'google play movies': 'https://play.google.com/store/movies',
            'google play': 'https://play.google.com/store/movies',
            'youtube': 'https://www.youtube.com',
            'crunchyroll': 'https://www.crunchyroll.com',
            'globoplay': 'https://globoplay.globo.com',
            'claro tv+': 'https://www.claro.com.br/tvplus',
            'claro video': 'https://www.claro.com.br/tvplus',
            'tubi': 'https://tubi.tv',
            'pluto tv': 'https://pluto.tv',
            'peacock': 'https://www.peacocktv.com',
            'peacock tv': 'https://www.peacocktv.com',
            'rakuten tv': 'https://www.rakutentv.com',
            'rakuten': 'https://www.rakutentv.com',
            'mubi': 'https://mubi.com',
            'arte': 'https://www.arte.tv',
            'hulu': 'https://www.hulu.com',
            'stan': 'https://www.stan.com.au',
            'binge': 'https://www.binge.com.au',
            'star+': 'https://www.starplus.com',
            'star plus': 'https://www.starplus.com',
            'movistar+': 'https://ver.movistarplus.es',
            'sky': 'https://www.sky.com',
            'now tv': 'https://www.nowtv.it',
            'itv': 'https://www.itv.com',
            'all 4': 'https://www.channel4.com',
            'bbc i player': 'https://www.bbc.co.uk/iplayer',
            'directv': 'https://www.directv.com',
            'fandango at home': 'https://athome.fandango.com',
            'vudu': 'https://vudu.com',
        };
        
        const getPlatformUrl = (platformName) => {
            const normalized = platformName.toLowerCase().replace(/\s+/g, ' ').trim();
            for (const [key, url] of Object.entries(platformUrls)) {
                if (normalized === key || normalized.includes(key) || key.includes(normalized)) return url;
            }
            return null;
        };
        
        const flatrate = movie.streaming.filter(p => p.type === 'flatrate' && !p.isFree);
        const flatrateFree = movie.streaming.filter(p => p.type === 'flatrate' && p.isFree);
        const rent = movie.streaming.filter(p => p.type === 'rent');
        const buy = movie.streaming.filter(p => p.type === 'buy');
        const freeAlt = movie.streaming.filter(p => p.type === 'free-alt');
        
        let html = '<div class="modal-platforms">';
        
        if (flatrate.length > 0 || flatrateFree.length > 0 || freeAlt.length > 0) {
            html += '<h4><i class="fas fa-play" aria-hidden="true"></i> ' + t('streaming') + '</h4>';
            html += '<div class="streaming-list">';
            
            if (freeAlt.length > 0) {
                html += freeAlt.map(p => {
                    const url = p.link;
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="stream-tag stream-free stream-free-alt" title="${p.name} - Opção Gratuita" aria-label="${p.name} - Assistir grátis">
                        <i class="fas fa-play" aria-hidden="true"></i>
                        <span>${p.name}</span>
                    </a>`;
                }).join('');
            }
            
            if (flatrateFree.length > 0) {
                html += flatrateFree.map(p => {
                    const url = getPlatformUrl(p.name);
                    if (url) {
                        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="stream-tag stream-free" title="${p.name} (Gratuito)" aria-label="${p.name} - Gratuito">
                            <span>${p.name}</span>
                            <i class="fas fa-tag" title="Gratuito" aria-hidden="true"></i>
                        </a>`;
                    }
                    return '';
                }).join('');
            }
            
            if (flatrate.length > 0) {
                html += flatrate.map(p => {
                    const url = getPlatformUrl(p.name);
                    if (url) {
                        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="stream-tag" title="${p.name}" aria-label="Assistir em ${p.name}">
                            <span>${p.name}</span>
                        </a>`;
                    }
                    return '';
                }).join('');
            }
            
            html += '</div>';
        }
        
        if (rent.length > 0) {
            html += '<h4><i class="fas fa-shopping-cart" aria-hidden="true"></i> ' + t('rent') + '</h4>';
            html += '<div class="streaming-list">';
            html += rent.map(p => {
                const url = getPlatformUrl(p.name);
                if (url) {
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="stream-tag stream-rent" title="Alugar em ${p.name}" aria-label="Alugar em ${p.name}">
                        <span>${p.name}</span>
                    </a>`;
                }
                return '';
            }).join('');
            html += '</div>';
        }
        
        if (buy.length > 0) {
            html += '<h4><i class="fas fa-shopping-bag" aria-hidden="true"></i> ' + t('buy') + '</h4>';
            html += '<div class="streaming-list">';
            html += buy.map(p => {
                const url = getPlatformUrl(p.name);
                if (url) {
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="stream-tag stream-buy" title="Comprar em ${p.name}" aria-label="Comprar em ${p.name}">
                        <span>${p.name}</span>
                    </a>`;
                }
                return '';
            }).join('');
            html += '</div>';
        }
        
        html += '</div>';
        streamingHtml = html;
    }
    
    const trailerLink = movie.trailer || '';
    
    titleEl.textContent = movie.title;
    
    let genresHtml = '';
    if (movie.genres && movie.genres.length > 0) {
        genresHtml = movie.genres.map(g => `<span>${g.name}</span>`).join('');
    }
    
    bodyEl.innerHTML = `
        <div class="modal-flex">
            <div class="modal-poster">
                ${posterUrl ? 
                    `<img src="${posterUrl}" alt="${movie.title}">` :
                    `<div class="poster-placeholder" aria-hidden="true"><i class="fas fa-film"></i></div>`
                }
            </div>
            <div class="modal-details">
                <h3>${movie.title}</h3>
                <div class="modal-tags">
                    ${hasVotes && rating ? `<span class="rating-tag"><i class="fas fa-star" aria-hidden="true"></i> ${rating}/10</span>` : ''}
                    ${year ? `<span>${year}</span>` : ''}
                    ${movie.runtime ? `<span>${movie.runtime} min</span>` : ''}
                </div>
                <div class="modal-tags">
                    ${genresHtml}
                </div>
                ${streamingHtml}
                <p class="modal-desc">${movie.overview || t('synopsisNotAvailable')}</p>
                ${movie.original_title !== movie.title ? 
                    `<p><strong>${t('originalTitle')}:</strong> ${movie.original_title}</p>` : ''}
                ${trailerLink ? `
                <a href="${trailerLink}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="trailer-btn"
                   aria-label="${t('watchTrailer')} - ${movie.title}">
                    <i class="fab fa-youtube" aria-hidden="true"></i>
                    <span>${t('watchTrailer')}</span>
                </a>` : ''}
            </div>
        </div>
    `;
    
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    trapFocus(modal);
    
    // Focus close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

function closeMovieModal() {
    const modal = document.getElementById('movieModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Restore focus
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

// ========================================
// NAVIGATION
// ========================================
function toggleNavMenu() {
    const menu = document.getElementById('navMenu');
    const btn = document.querySelector('.hamburger-btn');
    const isOpen = menu.classList.toggle('open');
    
    btn.setAttribute('aria-expanded', isOpen.toString());
}

// ========================================
// WINDOW EXPORTS
// ========================================
window.goToPage = window.goToPage;
window.showMovieDetails = window.showMovieDetails;
window.toggleAIPanel = window.toggleAIPanel;
window.askAI = window.askAI;
