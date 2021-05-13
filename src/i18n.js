import i18n, { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ht from './locales/ht.json';
import ar from './locales/ar.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  },
  pt: {
    translation: pt
  },
  ht: {
    translation: ht
  },
  ar: {
    translation: ar
  }
};

use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('language'),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
