(function () {
    var PREFIX = {
        'pt-BR': '',
        'en': 'en',
        'es': 'es',
        'zh': 'zh',
        'zh-hk': 'zh-hk',
        'ja': 'ja',
        'ru': 'ru',
        'ko': 'ko'
    };

    var STRINGS = {
        'pt-BR': {
            lang: 'pt-BR',
            title: 'Página não encontrada - CineWorld',
            description: 'A página que você procura não existe ou foi movida. Volte ao catálogo do CineWorld ou acesse as páginas legais.',
            h1: 'Página não encontrada',
            p: 'O endereço que você acessou não existe, foi movido ou o link está incorreto. Use os atalhos abaixo para continuar navegando.',
            catalog: 'Voltar ao catálogo',
            about: 'Sobre o CineWorld',
            legal: 'Páginas legais',
            privacy: 'Política de privacidade',
            terms: 'Termos de uso',
            about2: 'Sobre'
        },
        'en': {
            lang: 'en',
            title: 'Page not found - CineWorld',
            description: 'The page you are looking for does not exist or has moved. Go back to the CineWorld catalogue or open the legal pages.',
            h1: 'Page not found',
            p: 'The address you tried to reach does not exist, has moved, or the link is incorrect. Use the shortcuts below to keep browsing.',
            catalog: 'Back to the catalogue',
            about: 'About CineWorld',
            legal: 'Legal pages',
            privacy: 'Privacy policy',
            terms: 'Terms of use',
            about2: 'About'
        },
        'es': {
            lang: 'es',
            title: 'Página no encontrada - CineWorld',
            description: 'La página que buscas no existe o se ha movido. Vuelve al catálogo de CineWorld o abre las páginas legales.',
            h1: 'Página no encontrada',
            p: 'La dirección que has intentado abrir no existe, se ha movido o el enlace es incorrecto. Usa los atajos de abajo para seguir navegando.',
            catalog: 'Volver al catálogo',
            about: 'Acerca de CineWorld',
            legal: 'Páginas legales',
            privacy: 'Política de privacidad',
            terms: 'Términos de uso',
            about2: 'Acerca de'
        },
        'zh': {
            lang: 'zh-CN',
            title: '页面未找到 - CineWorld',
            description: '你查找的页面不存在或已被移动。请返回 CineWorld 目录或查看法律页面。',
            h1: '页面未找到',
            p: '你访问的地址不存在、已被移动，或者链接有误。请使用下面的快捷入口继续浏览。',
            catalog: '返回目录',
            about: '关于 CineWorld',
            legal: '法律页面',
            privacy: '隐私政策',
            terms: '使用条款',
            about2: '关于'
        },
        'zh-hk': {
            lang: 'zh-HK',
            title: '找不到頁面 - CineWorld',
            description: '你尋找的頁面不存在或已被移動。請返回 CineWorld 目錄或查看法律頁面。',
            h1: '找不到頁面',
            p: '你嘗試開啟的網址不存在、已被移動，或連結有誤。請使用下方的捷徑繼續瀏覽。',
            catalog: '返回目錄',
            about: '關於 CineWorld',
            legal: '法律頁面',
            privacy: '私隱政策',
            terms: '使用條款',
            about2: '關於'
        },
        'ja': {
            lang: 'ja',
            title: 'ページが見つかりません - CineWorld',
            description: 'お探しのページは存在しないか、移動されました。CineWorld のカタログに戻るか、法的情報をご覧ください。',
            h1: 'ページが見つかりません',
            p: 'アクセスしたアドレスは存在しないか、移動されたか、リンクが正しくありません。下のショートカットから続けてご覧ください。',
            catalog: 'カタログに戻る',
            about: 'CineWorld について',
            legal: '法的情報',
            privacy: 'プライバシーポリシー',
            terms: '利用規約',
            about2: '概要'
        },
        'ru': {
            lang: 'ru',
            title: 'Страница не найдена - CineWorld',
            description: 'Страница, которую вы ищете, не существует или была перемещена. Вернитесь в каталог CineWorld или откройте правовые страницы.',
            h1: 'Страница не найдена',
            p: 'Адрес, который вы открыли, не существует, был перемещён или ссылка неверна. Используйте ярлыки ниже, чтобы продолжить.',
            catalog: 'Вернуться в каталог',
            about: 'О CineWorld',
            legal: 'Правовые страницы',
            privacy: 'Политика конфиденциальности',
            terms: 'Условия использования',
            about2: 'О проекте'
        },
        'ko': {
            lang: 'ko',
            title: '페이지를 찾을 수 없습니다 - CineWorld',
            description: '찾으시는 페이지가 존재하지 않거나 이동되었습니다. CineWorld 카탈로그로 돌아가거나 법적 고지를 확인하세요.',
            h1: '페이지를 찾을 수 없습니다',
            p: '접속한 주소가 존재하지 않거나 이동되었거나 링크가 잘못되었습니다. 아래 바로가기를 사용해 계속 둘러보세요.',
            catalog: '카탈로그로 돌아가기',
            about: 'CineWorld 소개',
            legal: '법적 고지',
            privacy: '개인정보 처리방침',
            terms: '이용약관',
            about2: '소개'
        }
    };

    function pathLocale() {
        var seg = (window.location.pathname.split('/')[1] || '').toLowerCase();
        if (seg === '') return null;
        if (seg === 'pt' || seg === 'pt-br') return 'pt-BR';
        if (seg === 'en' || seg === 'es' || seg === 'zh' || seg === 'zh-hk' || seg === 'ja' || seg === 'ru' || seg === 'ko') return seg;
        return null;
    }

    function browserLocale() {
        var nav = String(navigator.language || navigator.userLanguage || 'pt-BR').toLowerCase();
        if (nav.indexOf('zh-hk') === 0 || nav.indexOf('zh-tw') === 0 || nav.indexOf('zh-mo') === 0 || nav.indexOf('zh-hant') === 0) return 'zh-hk';
        if (nav.indexOf('zh') === 0) return 'zh';
        var base = nav.split('-')[0];
        if (base === 'pt') return 'pt-BR';
        if (STRINGS[base]) return base;
        return 'pt-BR';
    }

    var lang = pathLocale() || browserLocale();
    var dict = STRINGS[lang] || STRINGS['pt-BR'];
    var prefix = PREFIX[lang] || '';
    var home = prefix ? '/' + prefix : '/';

    function pagePath(name) {
        return '/' + (prefix ? prefix + '/' : '') + name;
    }

    function setHref(id, href) {
        var el = document.getElementById(id);
        if (el) el.setAttribute('href', href);
    }

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
        var key = nodes[i].getAttribute('data-i18n');
        if (dict[key]) nodes[i].textContent = dict[key];
    }

    document.title = dict.title;
    document.documentElement.lang = dict.lang;

    var meta = document.getElementById('metaDescription');
    if (meta) meta.setAttribute('content', dict.description);

    setHref('linkHome', home);
    setHref('linkAbout', pagePath('sobre'));
    setHref('linkAbout2', pagePath('sobre'));
    setHref('linkPrivacy', pagePath('privacidade'));
    setHref('linkTerms', pagePath('termos'));
})();
