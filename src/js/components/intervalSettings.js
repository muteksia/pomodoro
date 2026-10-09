import store from '../store.js';
import { timerDisplay } from './timerDisplay.js';
import { timer } from '../utils/timer.js';

const MIN_INTERVAL = 2;
const MAX_INTERVAL = 12;
const DEFAULT_INTERVAL = 4;

const renderDisplay = () => {
    const el = document.getElementById('interval-display-val');
    if (el) {
        el.textContent = store.getState().longBreakInterval;
    }
};

export const getInterval = () => store.getState().longBreakInterval;

export const render = () => {
    renderDisplay();
};

export const increment = () => {
    const s = store.getState();
    if (s.longBreakInterval < MAX_INTERVAL) {
        const newVal = s.longBreakInterval + 1;
        store.setState({ longBreakInterval: newVal });
        renderDisplay();
        timerDisplay.render(timer.getRemainingSeconds(), s.mode, s.currentSession);
    }
};

export const decrement = () => {
    const s = store.getState();
    if (s.longBreakInterval > MIN_INTERVAL) {
        const newVal = s.longBreakInterval - 1;
        let cur = s.currentSession;
        if (cur > newVal) cur = newVal;
        store.setState({ longBreakInterval: newVal, currentSession: cur });
        renderDisplay();
        timerDisplay.render(timer.getRemainingSeconds(), s.mode, cur);
    }
};

export const resetDefaults = () => {
    const s = store.getState();
    let cur = s.currentSession;
    if (cur > DEFAULT_INTERVAL) cur = DEFAULT_INTERVAL;
    store.setState({ longBreakInterval: DEFAULT_INTERVAL, currentSession: cur });
    renderDisplay();
    timerDisplay.render(timer.getRemainingSeconds(), s.mode, cur);
};

