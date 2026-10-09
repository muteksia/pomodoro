const DEFAULT_LOCALE = 'en';
const LOCALES_PATH = 'src/locales';
const store = Object.create(null);
let locale = DEFAULT_LOCALE;
let readyPromise = null;

const flatten = (source, prefix, target) => {
  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, path, target);
    } else {
      target[path] = value;
    }
  }
  return target;
};

const interpolate = (template, params) => {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? params[name] : match
  );
};

const loadLocale = async (lang) => {
  const response = await fetch(`${LOCALES_PATH}/${lang}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load locale: ${lang}`);
  }
  const data = await response.json();
  for (const key of Object.keys(store)) delete store[key];
  Object.assign(store, flatten(data, '', {}));
  locale = lang;
  return store;
};

const t = (key, params) => {
  const value = Object.prototype.hasOwnProperty.call(store, key) ? store[key] : key;
  return typeof value === 'string' ? interpolate(value, params) : value;
};

const applyAttributes = (element) => {
  for (const pair of element.dataset.i18nAttr.split(';')) {
    const separator = pair.indexOf(':');
    if (separator === -1) continue;
    const attribute = pair.slice(0, separator).trim();
    const key = pair.slice(separator + 1).trim();
    if (attribute && key) element.setAttribute(attribute, t(key));
  }
};

const translateNode = (root) => {
  if (root.nodeType === Node.ELEMENT_NODE && root.matches('[data-i18n]')) {
    root.textContent = t(root.dataset.i18n);
  }
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  if (root.nodeType === Node.ELEMENT_NODE && root.matches('[data-i18n-attr]')) {
    applyAttributes(root);
  }
  root.querySelectorAll('[data-i18n-attr]').forEach(applyAttributes);
};

const translatePage = () => {
  translateNode(document);
  document.documentElement.lang = locale;
};

const getLocale = () => locale;

const setLanguage = async (lang) => {
  await loadLocale(lang);
  translatePage();
};

const init = (lang = DEFAULT_LOCALE) => {
  if (!readyPromise) {
    readyPromise = loadLocale(lang).then(() => {
      if (document.readyState === 'loading') {
        return new Promise((resolve) => {
          document.addEventListener('DOMContentLoaded', () => {
            translatePage();
            resolve(store);
          }, { once: true });
        });
      }
      translatePage();
      return store;
    });
  }
  return readyPromise;
};

export const i18n = { t, translatePage, translateNode, init, setLanguage, getLocale };
export { t, translatePage, translateNode, init, setLanguage, getLocale };

