const STORAGE_KEY = 'pomodoro-settings';

const defaultState = {
    mode: 'pomodoro',
    durations: { pomodoro: 1500, short: 300, long: 900 },
    remainingSeconds: 1500,
    currentSession: 1,
    longBreakInterval: 4,
    autoStart: { pomodoro: false, short: false, long: false },
    language: 'en',
    isRunning: false
};

const loadFromStorage = () => {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (serialized) {
            const parsed = JSON.parse(serialized);
            return {
                ...defaultState,
                durations: {
                    ...defaultState.durations,
                    ...(parsed.durations || {})
                },
                longBreakInterval: parsed.longBreakInterval ?? defaultState.longBreakInterval,
                autoStart: {
                    ...defaultState.autoStart,
                    ...(parsed.autoStart || {})
                },
                language: parsed.language ?? defaultState.language
            };
        }
    } catch (e) {
        console.warn('Failed to load settings from localStorage', e);
    }
    return defaultState;
};

const saveToStorage = (currentState) => {
    try {
        const toSave = {
            durations: currentState.durations,
            longBreakInterval: currentState.longBreakInterval,
            autoStart: currentState.autoStart,
            language: currentState.language
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
        console.warn('Failed to save settings to localStorage', e);
    }
};

const store = (() => {
    let state = loadFromStorage();
    const listeners = [];
    const getState = () => ({ ...state });
    const setState = (partial) => {
        state = { ...state, ...partial };
        saveToStorage(state);
        listeners.forEach((cb) => cb(state));
    };
    const subscribe = (cb) => { listeners.push(cb); };
    return { getState, setState, subscribe };
})();

export default store;
