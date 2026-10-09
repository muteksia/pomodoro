import store from '../store.js';

const TOGGLE_IDS = {
    pomodoro: 'toggle-auto-pomo',
    short: 'toggle-auto-short',
    long: 'toggle-auto-long'
};

export const getAutoStart = () => ({ ...store.getState().autoStart });

export const render = () => {
    const autoStart = store.getState().autoStart;
    for (const [mode, id] of Object.entries(TOGGLE_IDS)) {
        const el = document.getElementById(id);
        if (el) el.checked = autoStart[mode];
    }
};

export const readFromToggles = () => {
    const autoStart = {};
    for (const [mode, id] of Object.entries(TOGGLE_IDS)) {
        const el = document.getElementById(id);
        autoStart[mode] = el ? el.checked : false;
    }
    store.setState({ autoStart });
    return getAutoStart();
};

export const resetDefaults = () => {
    const autoStart = { pomodoro: false, short: false, long: false };
    store.setState({ autoStart });
    render();
};

