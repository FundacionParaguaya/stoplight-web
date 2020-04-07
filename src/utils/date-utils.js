const DATE_FORMATS_BY_LANG = {
  es: 'D [de] MMMM, YYYY',
  en: 'MMMM D, YYYY',
  pt: 'D [de] MMMM, YYYY'
};

const MONTH_FORMATS_BY_LANG = {
  es: 'D [de] MMMM',
  en: 'MMMM D',
  pt: 'D [de] MMMM'
};

const getDateFormatByLocale = lang => {
  const format = DATE_FORMATS_BY_LANG[lang];
  return format || DATE_FORMATS_BY_LANG.en;
};

const getMonthFormatByLocale = lang => {
  const format = MONTH_FORMATS_BY_LANG[lang];
  return format || MONTH_FORMATS_BY_LANG.en;
};

export { getMonthFormatByLocale, getDateFormatByLocale, DATE_FORMATS_BY_LANG };
