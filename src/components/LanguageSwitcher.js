import React, { useMemo, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import i18n from '../i18n';

const LanguageSwitcher = props => {
  const { location } = props;

  let lang = useMemo(() => {
    let language = '';
    const parsedQuerys = queryString.parse(location.search);
    if (parsedQuerys && parsedQuerys.lang) {
      language = parsedQuerys.lang;
    }
    return language;
  }, [location.search]);
  lang = lang || localStorage.getItem('language') || 'en';
  useEffect(() => {
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
  }, [lang]);
  return <React.Fragment />;
};

export default withRouter(LanguageSwitcher);
