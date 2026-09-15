import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LOCALES, resolveInitialLocale } from './locales';

// Resources are derived from the locale registry, so a new locale needs no edit here.
const resources = Object.fromEntries(
  Object.values(LOCALES).map((meta) => [meta.code, { translation: meta.resource }]),
);

void i18n.use(initReactI18next).init({
  resources,
  lng: resolveInitialLocale(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
