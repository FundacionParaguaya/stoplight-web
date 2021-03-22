export const NUMBER_FORMAT_PER_LANG = {
  en: {
    THOUSAND: ',',
    DECIMAL: '.'
  },
  es: {
    THOUSAND: '.',
    DECIMAL: ','
  }
};

export const getThousandSeparatorByLang = lang => {
  const conf = NUMBER_FORMAT_PER_LANG[lang] || NUMBER_FORMAT_PER_LANG.en;
  return conf.THOUSAND;
};

export const getDecimalSeparatorByLang = lang => {
  const conf = NUMBER_FORMAT_PER_LANG[lang] || NUMBER_FORMAT_PER_LANG.en;
  return conf.DECIMAL;
};

export const getLanguageByCode = langCode => {
  return langCode === 'ht' ? 'fr' : langCode;
};
