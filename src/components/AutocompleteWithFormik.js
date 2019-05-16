import React from 'react';
import propTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import * as _ from 'lodash';
import { connect } from 'formik';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';
import Autocomplete from './Autocomplete';

const AutocompleteWithFormik = ({
  classes,
  formik,
  name,
  label,
  required,
  textFieldProps,
  t,
  i18n,
  tReady,
  // If these props are passed, it'll calculate the options and value for the autocomplete
  rawOptions,
  valueKey,
  labelKey,
  // These props defeat the keys and rawOptions. Won't try to know what's current value and options
  value,
  options,
  ...props
}) => {
  const error = pathHasError(name, formik.touched, formik.errors);
  const helperText = getErrorLabelForPath(
    name,
    formik.touched,
    formik.errors,
    t
  );

  let effectiveOptions = options;
  let effectiveValue = value;
  // If parent specifies the following props, we can infer what are the actual
  // options and the value from the raw options array, and the keys for
  // label and value
  if (rawOptions && valueKey && labelKey) {
    effectiveOptions = (rawOptions || []).map(o => ({
      label: o[labelKey],
      value: o[valueKey]
    }));
    const valueFromFormik = _.get(formik.values, name);
    effectiveValue = {
      value: valueFromFormik,
      label: valueFromFormik
        ? rawOptions.find(e => e[valueKey] === valueFromFormik)[labelKey]
        : ''
    };
  }

  const onBlur = () => formik.setFieldTouched(name);
  const onChange = v => formik.setFieldValue(name, v ? v.value : '');
  const innerProps = {
    name,
    options: effectiveOptions,
    value: effectiveValue,
    onBlur,
    onChange,
    fullWidth: true
  };
  const autocompleteProps = { ...innerProps, ...props };
  const fieldProps = {
    label,
    required,
    error,
    helperText,
    ...{ ...(textFieldProps || {}) }
  };
  return <Autocomplete {...autocompleteProps} textFieldProps={fieldProps} />;
};

AutocompleteWithFormik.propTypes = {
  name: propTypes.string.isRequired,
  label: propTypes.string,
  rawOptions: propTypes.array,
  valueKey: propTypes.string,
  labelKey: propTypes.string
};

const styles = () => ({});

export default withStyles(styles)(
  withTranslation()(connect(AutocompleteWithFormik))
);
