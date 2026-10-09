const TOGGLE_IDS = {
    pomodoro: 'toggle-auto-pomo',
    short: 'toggle-auto-short',
    long: 'toggle-auto-long'
};

let autoStart = { pomodoro: false, short: false, long: false };

export const getAutoStart = () => ({ ...autoStart });

export const render = () => {
    for (const [mode, id] of Object.entries(TOGGLE_IDS)) {
        document.getElementById(id).checked = autoStart[mode];
    }
};

export const readFromToggles = () => {
    for (const [mode, id] of Object.entries(TOGGLE_IDS)) {
        autoStart[mode] = document.getElementById(id).checked;
    }
    return getAutoStart();
};

export const resetDefaults = () => {
    autoStart = { pomodoro: false, short: false, long: false };
    render();
};
