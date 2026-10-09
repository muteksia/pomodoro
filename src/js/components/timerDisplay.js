import { i18n } from '../i18n/i18n.js';
import { modeTabs } from './modeTabs.js';
import { timer } from '../utils/timer.js';
import { toSeconds, formatTime } from '../utils/time.js';

const timerDisplayEl = document.getElementById('timer-display');
const progressBar = document.getElementById('session-progress-bar');
const phaseLabel = document.getElementById('current-phase-label');
const sessionDotsWrapper = document.getElementById('session-dots-wrapper');
const sessionCountText = document.getElementById('session-count-text');

const SESSIONS_PER_CYCLE = 4;
let MODE_DURATIONS = { pomodoro: 1500, short: 300, long: 900 };
const PHASE_LABEL_KEYS = {
    pomodoro: 'timer.phaseLabel.pomodoro',
    short: 'timer.phaseLabel.shortBreak',
    long: 'timer.phaseLabel.longBreak'
};
const DOT_CLASSES = {
    completed: 'bg-primary',
    active: 'bg-primary shadow-[0_0_8px_rgba(79,219,200,0.8)]',
    upcoming: 'bg-surface-container-highest'
};

const setDurations = (durations) => {
    MODE_DURATIONS = {
        pomodoro: toSeconds(durations.pomodoro.hours, durations.pomodoro.minutes, durations.pomodoro.seconds),
        short: toSeconds(durations.short.hours, durations.short.minutes, durations.short.seconds),
        long: toSeconds(durations.long.hours, durations.long.minutes, durations.long.seconds)
    };
};

const getModeDuration = (mode) => MODE_DURATIONS[mode] ?? MODE_DURATIONS.pomodoro;

const renderTimer = (seconds) => {
    timerDisplayEl.textContent = formatTime(seconds);
};

const renderProgress = (seconds, totalSeconds) => {
    const ratio = totalSeconds > 0 ? (totalSeconds - seconds) / totalSeconds : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
};

const renderPhaseLabel = (mode) => {
    phaseLabel.textContent = i18n.t(PHASE_LABEL_KEYS[mode] ?? PHASE_LABEL_KEYS.pomodoro);
};

const renderSessionDots = (activeIndex) => {
    sessionDotsWrapper.innerHTML = '';
    for (let i = 0; i < SESSIONS_PER_CYCLE; i++) {
        const state = i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'upcoming';
        const dot = document.createElement('span');
        dot.className = `w-2 h-2 rounded-full ${DOT_CLASSES[state]}`;
        dot.title = i18n.t(`timer.sessionDots.${state}`);
        sessionDotsWrapper.appendChild(dot);
    }
    sessionCountText.textContent = i18n.t('timer.sessionCount', {
        current: activeIndex + 1,
        total: SESSIONS_PER_CYCLE
    });
};

const render = (seconds, mode, activeIndex) => {
    renderTimer(seconds);
    renderProgress(seconds, getModeDuration(mode));
    renderPhaseLabel(mode);
    renderSessionDots(activeIndex);
};

const init = () => {
    render(timer.getRemainingSeconds(), modeTabs.getCurrentMode(), 0);
};

export const timerDisplay = {
    init,
    render,
    renderTimer,
    renderProgress,
    renderPhaseLabel,
    renderSessionDots,
    getModeDuration,
    setDurations
};