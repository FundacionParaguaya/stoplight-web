import * as _ from 'lodash';

const getErrorLabelForPath = (path, touched, errors, t) =>
  _.get(touched, path) && _.get(errors, path) && t(_.get(errors, path));
const pathHasError = (path, touched, errors) =>
  !!(_.get(touched, path) && _.get(errors, path));

const constructEstimatedMonthsOptions = t => {
  const MAX_MONTHS = 24;
  const monthsArray = [];

  Array(MAX_MONTHS)
    .fill('')
    .forEach((_val, index) => {
      const i = index + 1;
      let label = `${i} ${t('views.priority.months')}`;
      if (i === 1) {
        label = `${i} ${t('views.priority.month')}`;
      }
      monthsArray.push({ value: i, label });
    });

  return monthsArray;
};

const capitalize = (str = '', lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match =>
    match.toUpperCase()
  );

const parseLines = value => value.replace(/(\n)/g, '\\n');
const unParseLines = value => value.replace(/(\\n)/g, '\n');

export {
  getErrorLabelForPath,
  pathHasError,
  constructEstimatedMonthsOptions,
  capitalize,
  parseLines,
  unParseLines
};
