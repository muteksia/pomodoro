import { i18n } from './i18n/i18n.js';

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

  const probe = document.createElement('span');
  probe.dataset.i18n = 'nav.insights';
  document.body.appendChild(probe);
  i18n.translateNode(probe);
  const translated = probe.textContent === 'Insights';
  probe.remove();

  if (!translated) {
    throw new Error('i18n self-check failed: translateNode did not translate data-i18n element');
  }

  return true;
};

i18n.init().then(assertTranslations);

