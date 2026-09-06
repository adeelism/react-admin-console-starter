import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import xx from './locales/xx.json';

// `xx` is a deliberately partial stub to prove the wiring; missing keys fall
// back to English.
void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    xx: { translation: xx },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
