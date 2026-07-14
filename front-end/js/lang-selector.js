(function () {
    var container = document.getElementById('langSelectorContainer');
    if (!container) return;

    var LANG_META = {
        'pt-BR': { name: 'Portugu\u00eas', native: 'Portugu\u00eas' },
        'en': { name: 'Ingl\u00eas', native: 'English' },
        'es': { name: 'Espanhol', native: 'Espa\u00f1ol' },
        'zh-CN': { name: 'Mandarim', native: '\u4e2d\u6587' },
        'zh-HK': { name: 'Canton\u00eas', native: '\u5ee3\u6771\u8a71' },
        'ja': { name: 'Japon\u00eas', native: '\u65e5\u672c\u8a9e' },
        'ru': { name: 'Russo', native: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
        'ko': { name: 'Coreano', native: '\ud55c\uad6d\uc5b4' }
    };

    var LANG_PATH = {
        'pt-BR': '',
        'en': 'en',
        'es': 'es',
        'zh-CN': 'zh',
        'zh-HK': 'zh-hk',
        'ja': 'ja',
        'ru': 'ru',
        'ko': 'ko'
    };

    var currentLang = localStorage.getItem('cineworld_language') || 'pt-BR';

    function buildItems() {
        var html = '';
        for (var code in LANG_META) {
            var m = LANG_META[code];
            var active = code === currentLang ? ' active' : '';
            var selected = code === currentLang ? 'true' : 'false';
            html += '<div class="lang-dropdown-item' + active + '" data-lang="' + code + '" role="option" aria-selected="' + selected + '" tabindex="0">';
            html += '<span class="lang-item-name">' + m.name + '</span>';
            html += '<span class="lang-item-native">' + m.native + '</span>';
            html += '</div>';
        }
        return html;
    }

    container.innerHTML =
        '<div class="lang-dropdown" id="langDropdown">' +
            '<button class="lang-dropdown-btn" id="langDropdownBtn" aria-label="Selecionar idioma" aria-expanded="false" aria-haspopup="listbox">' +
                '<span class="lang-current" id="currentLangName">' + LANG_META[currentLang].name + '</span>' +
                '<i class="fas fa-chevron-down lang-chevron" aria-hidden="true"></i>' +
            '</button>' +
            '<div class="lang-dropdown-panel" id="langDropdownPanel" role="listbox" aria-label="Idiomas dispon\u00edveis">' +
                buildItems() +
            '</div>' +
        '</div>';

    var btn = document.getElementById('langDropdownBtn');
    var panel = document.getElementById('langDropdownPanel');

    function openDropdown() {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
    }

    function closeDropdown() {
        btn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
    }

    function switchLanguage(lang) {
        if (lang === currentLang) { closeDropdown(); return; }
        localStorage.setItem('cineworld_language', lang);
        var prefix = LANG_PATH[lang] || '';
        var path = window.location.pathname.replace(/\/$/, '');
        var isIndex = path === '' || path === '/index.html' || document.querySelector('.movies-grid, #moviesGrid');
        if (isIndex) {
            window.location.href = prefix ? '/' + prefix + '/' : '/';
        } else {
            var parts = path.split('/').filter(Boolean);
            var firstPart = parts[0] ? parts[0].toLowerCase() : '';
            var known = { 'en':1,'es':1,'ja':1,'ru':1,'ko':1,'zh':1,'zh-hk':1 };
            if (known[firstPart]) parts.shift();
            var page = parts.join('/') || '';
            var dest = prefix ? '/' + prefix + (page ? '/' + page : '') : '/' + page;
            window.location.href = dest;
        }
    }

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        expanded ? closeDropdown() : openDropdown();
    });

    panel.addEventListener('click', function (e) {
        var item = e.target.closest('.lang-dropdown-item');
        if (!item) return;
        switchLanguage(item.getAttribute('data-lang'));
    });

    document.addEventListener('click', function (e) {
        if (!container.contains(e.target)) closeDropdown();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDropdown();
    });

    window.__langSelectorReady = true;
})();
