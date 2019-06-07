import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import * as _ from 'lodash';
import { connect } from 'formik';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';

const InputWithFormik = ({
  classes,
  formik,
  name,
  t,
  i18n,
  tReady,
  ...props
}) => {
  const value = _.get(formik.values, name) || '';
  const error = pathHasError(name, formik.touched, formik.errors);
  const helperText = getErrorLabelForPath(
    name,
    formik.touched,
    formik.errors,
    t
  );
  const onBlur = formik.handleBlur;
  const onChange = formik.handleChange;
  const innerProps = {
    name,
    className: classes.input,
    variant: 'filled',
    value,
    error,
    helperText,
    onBlur,
    onChange,
    fullWidth: true
  };
  useEffect(() => () => props.onChange({ target: { value: '' } }), []);
  const textFieldProps = { ...innerProps, ...props };
  return <TextField {...textFieldProps} />;
};

InputWithFormik.propTypes = {
  name: propTypes.string.isRequired,
  label: propTypes.string
};

const styles = () => ({
  input: {
    marginTop: 10,
    marginBottom: 10
  }
});

export default withStyles(styles)(withTranslation()(connect(InputWithFormik)));
