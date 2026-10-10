import store from '../store.js';

const SUPPORTED = ['light', 'dark'];
const ICONS = { light: 'dark_mode', dark: 'light_mode' };

export const applyTheme = (theme, { persist = true } = {}) => {
    const safe = SUPPORTED.includes(theme) ? theme : 'dark';
    document.documentElement.classList.toggle('dark', safe === 'dark');
    document.documentElement.classList.toggle('light', safe === 'light');
    document.documentElement.style.colorScheme = safe;
    if (persist) store.setState({ theme: safe });
    render();
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: safe } }));
};

export const render = () => {
    const icon = document.getElementById('theme-toggle-icon');
    const btn = document.getElementById('theme-toggle');
    const current = store.getState().theme;
    if (icon) icon.textContent = ICONS[current];
    if (btn) btn.setAttribute('aria-pressed', current === 'dark');
};

export const init = () => {
    const btn = document.getElementById('theme-toggle');
    applyTheme(store.getState().theme, { persist: false });
    btn?.addEventListener('click', () => {
        applyTheme(store.getState().theme === 'dark' ? 'light' : 'dark');
    });
};

export const resetDefaults = () => applyTheme('dark');
export const toggle = () => applyTheme(store.getState().theme === 'dark' ? 'light' : 'dark');

export const themeSettings = { init, applyTheme, resetDefaults, toggle };
