import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import store from './redux/store'
import en from './locales/en.json'
import es from './locales/es.json'

const language =
  navigator.language.split('-')[0] ||
  navigator.browserLanguage.split('-')[0] ||
  undefined

const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
}

/* eslint-disable import/no-named-as-default-member */

// set language after store rehydration
export const setLanguage = () => {
  const reduxLanguage = store.getState().language
  let lng

  // check if the app store has a set language from the user,
  // if not check the device language
  if (reduxLanguage) {
    lng = reduxLanguage
  } else {
    lng = language === 'en' || language === 'es' ? language : 'en'
  }
  i18n.changeLanguage(lng)
}

i18n.use(reactI18nextModule).init({
  resources,
  lng:  language === 'en' || language === 'es' ? language : 'en',
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})

export default i18n
