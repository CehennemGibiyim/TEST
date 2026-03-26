/**
 * Settings Module - Theme & Language Management
 */

const Settings = {
    STORAGE_KEY: 'albion_tr_settings',

    defaults: {
        theme: 'gold',
        language: 'tr'
    },

    current: {},

    init() {
        this.load();
        this.apply();
        this.setupListeners();
    },

    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            this.current = saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
        } catch (e) {
            this.current = { ...this.defaults };
        }
    },

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.current));
    },

    apply() {
        document.body.className = `theme-${this.current.theme}`;
    },

    setTheme(theme) {
        this.current.theme = theme;
        this.save();
        this.apply();
    },

    setLanguage(lang) {
        this.current.language = lang;
        this.save();
        if (typeof Lang !== 'undefined') {
            Lang.setLanguage(lang);
        }
    },

    setupListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleSettingsPanel());
        }

        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        document.querySelectorAll('.theme-color').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTheme(btn.dataset.theme);
                document.querySelectorAll('.theme-color').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLanguage(btn.dataset.lang);
            });
        });
    },

    toggleSettingsPanel() {
        const panel = document.querySelector('.settings-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    },

    toggleLanguage() {
        const newLang = this.current.language === 'tr' ? 'en' : 'tr';
        this.setLanguage(newLang);
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.querySelector('span').textContent = newLang.toUpperCase();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Settings.init());
