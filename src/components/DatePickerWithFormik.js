import React from 'react';
import propTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker } from '@material-ui/pickers';
import * as _ from 'lodash';
import * as moment from 'moment';
import { connect } from 'formik';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';
import { getDateMaskByLocale } from '../utils/date-utils';

const DatePickerWithFormik = ({
  classes,
  formik,
  name,
  t,
  i18n: { language },
  tReady,
  textFieldProps,
  ...props
}) => {
  const dateMask = getDateMaskByLocale(language);

  const error = pathHasError(name, formik.touched, formik.errors);
  const helperText = getErrorLabelForPath(
    name,
    formik.touched,
    formik.errors,
    t
  );
  const onBlur = () => formik.setFieldTouched(name);
  const onChange = e => formik.setFieldValue(name, e.unix());
  const currentValue = _.get(formik.values, name);

  const fieldProps = {
    variant: 'filled',
    className: classes.input
  };

  const innerProps = {
    format: dateMask,
    name,
    value: !!currentValue ? moment.unix(currentValue) : null,
    variant: 'filled',
    okLabel: t('general.ok'),
    cancelLabel: t('general.cancel'),
    error,
    helperText,
    onClose: onBlur,
    onChange,
    fullWidth: true,
    TextFieldComponent: passedProps => {
      const effectiveTextfieldProps = {
        ...passedProps,
        ...fieldProps,
        ...textFieldProps
      };
      return <TextField {...effectiveTextfieldProps} />;
    }
  };
  const datePickerProps = { ...innerProps, ...props };
  return <KeyboardDatePicker {...datePickerProps} />;
};

DatePickerWithFormik.propTypes = {
  name: propTypes.string.isRequired,
  label: propTypes.string
};

DatePickerWithFormik.defaultProps = {
  textFieldProps: {}
};

const styles = () => ({
  input: {
    marginTop: 10,
    marginBottom: 10
  }
});

export default withStyles(styles)(
  withTranslation()(connect(DatePickerWithFormik))
);
