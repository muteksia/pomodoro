import { i18n } from './i18n/i18n.js';
import { modeTabs } from './components/modeTabs.js';
import { timer } from './utils/timer.js';

const DEFAULT_DURATION = 1500;

const timerDisplay = document.getElementById('timer-display');
const btnToggle = document.getElementById('btn-toggle');
const btnReset = document.getElementById('btn-reset');

const formatTime = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

const renderTimer = (seconds) => {
  timerDisplay.textContent = formatTime(seconds);
};

const assertTranslations = () => {
  const expected = [
    ['nav.timer', undefined, 'Timer'],
    ['tabs.shortBreak', undefined, 'Short Break'],
    ['timer.sessionCount', { current: 2, total: 4 }, 'Session 2 of 4'],
    ['missing.key', undefined, 'missing.key']
  ];

  for (const [key, params, value] of expected) {
    const actual = i18n.t(key, params);
    if (actual !== value) {
      throw new Error(`i18n self-check failed for "${key}": expected "${value}", got "${actual}"`);
    }
  }

  return true;
};

timer.setOnTick(renderTimer);

btnToggle.addEventListener('click', () => {
  if (timer.getIsRunning()) {
    timer.pause();
  } else {
    timer.start();
  }
});

btnReset.addEventListener('click', () => {
  timer.reset(DEFAULT_DURATION);
});

i18n.init().then(() => {
  assertTranslations();
  modeTabs.init();
  renderTimer(timer.getRemainingSeconds());
});


