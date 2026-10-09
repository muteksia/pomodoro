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
        const nextSession = s.currentSession + 1;
        store.setState({ currentSession: nextSession });
        setMode(nextSession > s.longBreakInterval ? 'long' : 'short');
    } else if (s.mode === 'long') {
        store.setState({ currentSession: 1 });
        setMode('pomodoro');
    } else {
        setMode('pomodoro');
    }
};

export const skipSession = () => {
    completeSession();
};