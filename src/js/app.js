import { i18n } from './i18n/i18n.js';
import { modeTabs } from './components/modeTabs.js';
import { timer } from './utils/timer.js';
import { timerDisplay } from './components/timerDisplay.js';
import { controls } from './components/controls.js';
import { init as initSettingsDrawer, closeDrawer } from './components/settingsDrawer.js';
import * as durationSettings from './components/durationSettings.js';
import * as autoStartSettings from './components/autoStartSettings.js';
import * as intervalSettings from './components/intervalSettings.js';
import { completeSession } from './components/sessionCycle.js';
import { playFinish } from './utils/sound.js';
import * as notifications from './components/notifications.js';
import store from './store.js';
import './utils/shortcuts.js';

const tablist = document.querySelector('[role="tablist"]');

const initSettings = () => {
  initSettingsDrawer();
  autoStartSettings.render();
  intervalSettings.render();

  document.getElementById('stepper-dec').addEventListener('click', intervalSettings.decrement);
  document.getElementById('stepper-inc').addEventListener('click', intervalSettings.increment);

  document.getElementById('btn-save-settings').addEventListener('click', () => {
    if (durationSettings.validate()) {
      const newDurations = durationSettings.readFromInputs();
      timerDisplay.setDurations(newDurations);
      autoStartSettings.readFromToggles();
      timer.reset(timerDisplay.getModeDuration(store.getState().mode));
      controls.updateToggleButton();
      closeDrawer();
    }
  });

  document.getElementById('btn-default-settings').addEventListener('click', () => {
    durationSettings.resetDefaults();
    autoStartSettings.resetDefaults();
    intervalSettings.resetDefaults();
  });
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

timer.setOnTick((seconds) => {
  timerDisplay.render(seconds, store.getState().mode, store.getState().currentSession);
});

timer.setOnComplete(() => {
  const prevMode = store.getState().mode;
  completeSession();
  playFinish();
  if (Notification.permission === 'granted') {
    const title = 'Session complete';
    const body = prevMode === 'pomodoro' ? 'Break started' : 'Focus started';
    new Notification(title, { body });
  }
  controls.updateToggleButton();
  notifications.syncStatus();
});

tablist.addEventListener('click', (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (!tab || !tab.dataset.mode || tab.dataset.mode === store.getState().mode) return;
  const newMode = tab.dataset.mode;
  store.setState({ mode: newMode });
  timer.reset(timerDisplay.getModeDuration(newMode));
  modeTabs.setActiveTab(newMode);
  timerDisplay.render(timer.getRemainingSeconds(), newMode, store.getState().currentSession);
  controls.updateToggleButton();
});


i18n.init().then(() => {
  assertTranslations();
  modeTabs.init();
  timerDisplay.init();
  controls.init();
  initSettings();
  notifications.init();
});



