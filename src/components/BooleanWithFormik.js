import { FormControl, FormHelperText, Typography } from '@material-ui/core';
import { connect } from 'formik';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';
import GreenCheckbox from './GreenCheckbox';

const BooleanWithFormik = ({
  label,
  cleanUp = () => {},
  formik,
  name,
  tReady,
  required,
  inputRef,
  classes,
  ...props
}) => {
  const { t } = useTranslation();
  const value = get(formik.values, name) || false;
  const error = pathHasError(name, formik.touched, formik.errors);
  const helperText = getErrorLabelForPath(
    name,
    formik.touched,
    formik.errors,
    t
  );

  const onChange = v => {
    formik.setFieldValue(name, !value);
    cleanUp();
  };

  const onBlur = () => formik.setFieldTouched(name);

  return (
    <FormControl
      style={{
        width: '100%',
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <GreenCheckbox
        name={name}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      <Typography
        variant="subtitle1"
        style={{
          fontWeight: 400,
          fontFamily: 'Roboto'
        }}
      >
        {`${label}${required ? ' *' : ''}`}
      </Typography>

      {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

BooleanWithFormik.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default connect(BooleanWithFormik);
