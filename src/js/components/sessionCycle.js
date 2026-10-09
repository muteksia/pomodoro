import store from '../store.js';
import { timer } from '../utils/timer.js';
import { modeTabs } from './modeTabs.js';
import { timerDisplay } from './timerDisplay.js';

const startIfAutoStart = (mode) => {
    if (store.getState().autoStart[mode]) timer.start();
};

export const setMode = (newMode) => {
    const { durations } = store.getState();
    timer.pause();
    store.setState({ mode: newMode, remainingSeconds: durations[newMode] });
    modeTabs.setActiveTab(newMode);
    timer.reset(durations[newMode]);
    timerDisplay.render(durations[newMode], newMode, store.getState().currentSession);
    startIfAutoStart(newMode);
};

export const completeSession = () => {
    const s = store.getState();
    if (s.mode === 'pomodoro') {
        if (s.currentSession >= s.longBreakInterval) {
            store.setState({ currentSession: 1 });
            setMode('long');
        } else {
            store.setState({ currentSession: s.currentSession + 1 });
            setMode('short');
        }
    } else {
        setMode('pomodoro');
    }
};

export const skipSession = () => {
    completeSession();
};

