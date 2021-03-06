import React from 'react';
import {
  FormControlLabel,
  Radio,
  withStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid
} from '@material-ui/core';
import { connect } from 'formik';
import * as _ from 'lodash';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';

const RadioWithFormik = ({
  label,
  rawOptions,
  formik,
  name,
  t,
  tReady,
  required,
  inputRef,
  onChange,
  classes,
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

  const radioButtonProps = { name, onChange, ...props };
  const labelProps = { required, error };
  return (
    <FormControl className={classes.formContainer}>
      <StyledFormLabel component="legend" {...labelProps}>
        {label}
      </StyledFormLabel>

      <Grid container spacing={1}>
        {rawOptions.map(option => (
          <Grid
            item
            xs={6}
            sm={4}
            key={option.value}
            className={classes.gridCentering}
          >
            <FilledFormControlLabel
              control={
                <GreenRadio
                  {...radioButtonProps}
                  checked={value === option.value}
                />
              }
              label={option.text}
              value={option.value}
            />
          </Grid>
        ))}
      </Grid>
      {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

RadioWithFormik.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rawOptions: PropTypes.array.isRequired
};

const StyledFormLabel = withStyles(() => ({
  root: {
    color: '#909090',
    marginBottom: 15,
    marginTop: 15
  },
  focused: {
    color: '#909090!important'
  }
}))(props => <FormLabel color={'primary'} {...props} />);

const FilledFormControlLabel = withStyles(() => ({
  root: {
    background: '#F3F4F6',
    marginLeft: 0,
    minWidth: '100%',
    paddingRight: 15,
    borderRadius: 50,
    minHeight: 37
  }
}))(props => <FormControlLabel color={'primary'} {...props} />);

const GreenRadio = withStyles(theme => ({
  root: {
    color: '#909090'
  },
  checked: {
    color: theme.palette.primary.main
  }
}))(props => <Radio color={'primary'} {...props} />);

const styles = {
  gridCentering: {
    display: 'flex',
    alignItems: 'center'
  },
  formContainer: {
    width: '100%',
    marginBottom: 20
  }
};

export default withTranslation()(connect(withStyles(styles)(RadioWithFormik)));
