import store from '../store.js';
import { i18n } from '../i18n/i18n.js';

const SELECT_ID = 'select-language';
const SUPPORTED = ['en', 'id'];

const render = () => {
    const el = document.getElementById(SELECT_ID);
    if (el) el.value = store.getState().language;
};

export const applyLanguage = async (lang) => {
    const safeLang = SUPPORTED.includes(lang) ? lang : 'en';
    store.setState({ language: safeLang });
    await i18n.setLanguage(safeLang);
    render();
    document.dispatchEvent(new CustomEvent('languagechange'));
};

export const init = () => {
    const el = document.getElementById(SELECT_ID);
    if (!el) return;
    render();
    el.addEventListener('change', (event) => {
        applyLanguage(event.target.value);
    });
};

export const resetDefaults = () => {
    applyLanguage('en');
};