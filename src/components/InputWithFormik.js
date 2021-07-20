import * as _ from 'lodash';

import {
  getDecimalSeparatorByLang,
  getThousandSeparatorByLang
} from '../utils/lang-utils';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';

import NumberFormat from 'react-number-format';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { connect } from 'formik';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

const hasCustomLabelStyle = (label, value) => {
  if (label && label.length > 50 && !!value) {
    return true;
  }
  return false;
};

let NumberFormatCustom = props => {
  const {
    i18n: { language },
    t,
    tReady,
    inputRef,
    onChange,
    ...other
  } = props;

  return (
    <NumberFormat
      {...other}
      decimalScale={0}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator={getThousandSeparatorByLang(language)}
      decimalSeparator={getDecimalSeparatorByLang(language)}
      type="text"
      isNumericString={true}
    />
  );
};

NumberFormatCustom = withTranslation()(NumberFormatCustom);

const InputWithFormik = ({
  classes,
  formik,
  name,
  t,
  i18n,
  notAutoFill = false,
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
    className: [
      classes.input,
      hasCustomLabelStyle(props.label, value) && classes.inputLabel
    ],
    variant: 'filled',
    value,
    error,
    helperText,
    onBlur,
    onChange,
    fullWidth: true
  };
  const { type: inputType = 'text' } = props;
  const textFieldProps = { ...innerProps, ...props };

  return (
    <TextField
      {...textFieldProps}
      InputProps={{
        inputComponent: inputType === 'number' ? NumberFormatCustom : undefined,
        ...(textFieldProps.InputProps || {})
      }}
      autoComplete={notAutoFill ? 'new-password' : 'off'}
      InputLabelProps={{
        shrink: true
      }}
    />
  );
};

const styles = () => ({
  inputLabel: {
    '& > label': {
      top: 0
    }
  },
  input: {
    marginTop: 10,
    marginBottom: 10
  }
});

export default withStyles(styles)(withTranslation()(connect(InputWithFormik)));
