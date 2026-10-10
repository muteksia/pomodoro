import { i18n } from './i18n/i18n.js';
import { modeTabs } from './components/modeTabs.js';
import { timer } from './utils/timer.js';
import { timerDisplay } from './components/timerDisplay.js';
import { controls } from './components/controls.js';
import { init as initSettingsDrawer, closeDrawer } from './components/settingsDrawer.js';
import * as durationSettings from './components/durationSettings.js';
import * as autoStartSettings from './components/autoStartSettings.js';
import * as intervalSettings from './components/intervalSettings.js';
import * as languageSettings from './components/languageSettings.js';
import * as themeSettings from './components/themeSettings.js';
import { completeSession } from './components/sessionCycle.js';
import { playFinish } from './utils/sound.js';
import * as notifications from './components/notifications.js';
import store from './store.js';
import { splitSeconds } from './utils/time.js';
import './utils/shortcuts.js';

const tablist = document.querySelector('[role="tablist"]');

const initSettings = () => {
  initSettingsDrawer();
  const { durations } = store.getState();
  durationSettings.loadToInputs({
    pomodoro: splitSeconds(durations.pomodoro),
    short: splitSeconds(durations.short),
    long: splitSeconds(durations.long)
  });
  autoStartSettings.render();
  intervalSettings.render();
  languageSettings.init();
  themeSettings.init();

  const saveSettings = () => {
    if (durationSettings.validate()) {
      timerDisplay.setDurations(durationSettings.readFromInputs());
      autoStartSettings.readFromToggles();
      timer.reset(timerDisplay.getModeDuration(store.getState().mode));
      controls.updateToggleButton();
    }
  };

  document.querySelectorAll('#settings-drawer input').forEach(el => el.addEventListener('input', saveSettings));
  document.getElementById('stepper-dec').addEventListener('click', () => { intervalSettings.decrement(); saveSettings(); });
  document.getElementById('stepper-inc').addEventListener('click', () => { intervalSettings.increment(); saveSettings(); });

  document.getElementById('btn-default-settings').addEventListener('click', () => {
    durationSettings.resetDefaults();
    autoStartSettings.resetDefaults();
    intervalSettings.resetDefaults();
    languageSettings.resetDefaults();
    themeSettings.resetDefaults();
    saveSettings();
  });
};

const assertTranslations = () => {
  const expected = [
    ['app.title', undefined, 'Pomodoro'],
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


i18n.init('en').then(async () => {
  assertTranslations();
  const savedLang = store.getState().language;
  if (savedLang && savedLang !== 'en') {
    await i18n.setLanguage(savedLang);
  }
  timer.reset(timerDisplay.getModeDuration(store.getState().mode));
  modeTabs.init();
  timerDisplay.init();
  controls.init();
  initSettings();
  notifications.init();
  document.documentElement.classList.remove('loading');

  document.addEventListener('languagechange', () => {
    const { mode, currentSession } = store.getState();
    timerDisplay.render(timer.getRemainingSeconds(), mode, currentSession);
    controls.updateToggleButton();
    notifications.syncStatus();
  });
});



