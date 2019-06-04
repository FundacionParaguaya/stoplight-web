import React from 'react';
import {
  FormControlLabel,
  Radio,
  withStyles,
  FormControl,
  RadioGroup,
  FormLabel
} from '@material-ui/core';
import { connect } from 'formik';
import * as _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';

const RadioWithFormik = ({
  label,
  rawOptions,
  formik,
  name,
  t,
  tReady,
  required,
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
  const innerProps = {
    name,
    onBlur
    // error,
    // helperText
  };

  const radioButtonProps = { ...innerProps, ...props };
  return (
    <FormControl>
      <StyledFormLabel component="legend" required={required}>
        {label}
      </StyledFormLabel>
      <StyledRadioGroup value={value}>
        {rawOptions.map(option => (
          <FilledFormControlLabel
            control={<GreenRadio {...radioButtonProps} />}
            label={option.text}
            key={option.value}
            value={option.value}
          />
        ))}
      </StyledRadioGroup>
    </FormControl>
  );
};

const StyledRadioGroup = withStyles(() => ({
  root: {
    width: '100%',
    flexDirection: 'row'
  }
}))(props => <RadioGroup {...props} />);

const StyledFormLabel = withStyles(() => ({
  root: {
    color: '#909090',
    marginBottom: 10,
    marginTop: 10
  },
  focused: {
    color: '#909090!important'
  }
}))(props => <FormLabel color="default" {...props} />);

const FilledFormControlLabel = withStyles(() => ({
  root: {
    background: '#F3F4F6',
    marginLeft: 0,
    minWidth: 130,
    paddingRight: 30,
    borderRadius: 50,
    marginTop: 5,
    marginBottom: 5,
    height: 37,
    marginRight: 26
  }
}))(props => <FormControlLabel color="default" {...props} />);

const GreenRadio = withStyles(theme => ({
  root: {
    color: '#909090'
  },
  checked: {
    color: theme.palette.primary.main
  }
}))(props => <Radio color="default" {...props} />);

export default withTranslation()(connect(RadioWithFormik));
