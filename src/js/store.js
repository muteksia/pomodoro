const store = (() => {
    let state = {
        mode: 'pomodoro',
        durations: { pomodoro: 1500, short: 300, long: 900 },
        remainingSeconds: 1500,
        currentSession: 1,
        longBreakInterval: 4,
        autoStart: { pomodoro: false, short: false, long: false },
        isRunning: false
    };
    const listeners = [];
    const getState = () => ({ ...state });
    const setState = (partial) => {
        state = { ...state, ...partial };
        listeners.forEach((cb) => cb(state));
    };
    const subscribe = (cb) => { listeners.push(cb); };
    return { getState, setState, subscribe };
})();

export default store;
