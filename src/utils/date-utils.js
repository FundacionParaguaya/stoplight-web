const DATE_FORMATS_BY_LANG = {
  es: 'D [de] MMMM, YYYY',
  en: 'MMMM Do, YYYY'
};
const getDateFormatByLocale = lang => {
  const format = DATE_FORMATS_BY_LANG[lang];
  return format || DATE_FORMATS_BY_LANG.en;
};

export { getDateFormatByLocale, DATE_FORMATS_BY_LANG };
