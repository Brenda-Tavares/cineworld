(function () {
    var FILTERS = {
        filterOriginContainer: {
            selectId: 'filterOriginSelect',
            label: 'Tipo',
            getOptions: function () {
                var s = document.getElementById('filterOriginSelect');
                if (!s) return [];
                return Array.from(s.options).map(function (o) { return { value: o.value, text: o.text }; });
            },
            getValue: function () {
                return document.getElementById('filterOriginSelect').value;
            },
            onSelect: function (value) {
                document.getElementById('filterOriginSelect').value = value;
                document.getElementById('filterOriginSelect').dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        filterSortContainer: {
            selectId: 'filterSortSelect',
            label: 'Ordenar',
            getOptions: function () {
                var s = document.getElementById('filterSortSelect');
                if (!s) return [];
                return Array.from(s.options).map(function (o) { return { value: o.value, text: o.text }; });
            },
            getValue: function () {
                return document.getElementById('filterSortSelect').value;
            },
            onSelect: function (value) {
                document.getElementById('filterSortSelect').value = value;
                document.getElementById('filterSortSelect').dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        filterYearContainer: {
            selectId: 'filterYearSelect',
            label: 'Ano',
            getOptions: function () {
                var s = document.getElementById('filterYearSelect');
                if (!s) return [];
                return Array.from(s.options).map(function (o) { return { value: o.value, text: o.text }; });
            },
            getValue: function () {
                return document.getElementById('filterYearSelect').value;
            },
            onSelect: function (value) {
                document.getElementById('filterYearSelect').value = value;
                document.getElementById('filterYearSelect').dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };

    function buildPanelItems(filterDef) {
        var html = '';
        var opts = filterDef.getOptions();
        var currentVal = filterDef.getValue();
        for (var i = 0; i < opts.length; i++) {
            var o = opts[i];
            var active = o.value === currentVal ? ' active' : '';
            html += '<div class="custom-filter-item' + active + '" data-value="' + o.value + '" role="option" aria-selected="' + (o.value === currentVal) + '" tabindex="0">' + o.text + '</div>';
        }
        return html;
    }

    function initFilter(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var filterDef = FILTERS[containerId];
        if (!filterDef) return;

        var selectEl = document.getElementById(filterDef.selectId);
        if (!selectEl) return;

        selectEl.style.display = 'none';

        var btn = container.querySelector('.custom-filter-btn');
        var panel = container.querySelector('.custom-filter-panel');
        if (!btn || !panel) return;

        function updateValue() {
            var val = filterDef.getValue();
            var valueSpan = btn.querySelector('.custom-filter-value');
            if (valueSpan) {
                var opts = filterDef.getOptions();
                var found = false;
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].value === val) {
                        valueSpan.textContent = opts[i].text;
                        found = true;
                        break;
                    }
                }
                if (!found) valueSpan.textContent = '-';
            }
        }

        function rebuildPanel() {
            panel.innerHTML = buildPanelItems(filterDef);
        }

        function openFilter() {
            rebuildPanel();
            btn.setAttribute('aria-expanded', 'true');
            panel.classList.add('open');
        }

        function closeFilter() {
            btn.setAttribute('aria-expanded', 'false');
            panel.classList.remove('open');
        }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var expanded = btn.getAttribute('aria-expanded') === 'true';
            expanded ? closeFilter() : openFilter();
        });

        panel.addEventListener('click', function (e) {
            var item = e.target.closest('.custom-filter-item');
            if (!item) return;
            filterDef.onSelect(item.getAttribute('data-value'));
            updateValue();
            closeFilter();
        });

        document.addEventListener('click', function (e) {
            if (!container.contains(e.target)) closeFilter();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeFilter();
        });

        selectEl.addEventListener('change', updateValue);

        updateValue();
    }

    function initAll() {
        for (var id in FILTERS) {
            initFilter(id);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
