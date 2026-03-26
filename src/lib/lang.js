/**
 * Language Module - Multi-language Support
 */

const Lang = {
    current: 'tr',
    translations: {},

    data: {
        tr: {
            home: 'Ana Sayfa',
            market: 'Market',
            crafting: 'Crafting',
            pvp: 'PvP',
            guides: 'Rehberler',
            maps: 'Haritalar',
            tools: 'Araçlar',
            loading: 'Yükleniyor...',
            error: 'Bir hata oluştu',
            noData: 'Veri bulunamadı',
            search: 'Ara...',
            filter: 'Filtrele',
            refresh: 'Yenile',
            save: 'Kaydet',
            cancel: 'İptal'
        },
        en: {
            home: 'Home',
            market: 'Market',
            crafting: 'Crafting',
            pvp: 'PvP',
            guides: 'Guides',
            maps: 'Maps',
            tools: 'Tools',
            loading: 'Loading...',
            error: 'An error occurred',
            noData: 'No data found',
            search: 'Search...',
            filter: 'Filter',
            refresh: 'Refresh',
            save: 'Save',
            cancel: 'Cancel'
        }
    },

    init() {
        this.loadLanguage();
    },

    loadLanguage() {
        try {
            const saved = localStorage.getItem('albion_tr_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.current = settings.language || 'tr';
            }
        } catch (e) {
            this.current = 'tr';
        }
        this.translations = this.data[this.current] || this.data.tr;
    },

    setLanguage(lang) {
        if (this.data[lang]) {
            this.current = lang;
            this.translations = this.data[lang];
            this.updateUI();
        }
    },

    t(key) {
        return this.translations[key] || key;
    },

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.translations[key]) {
                el.textContent = this.translations[key];
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Lang.init());
