import React from 'react';
import {
  FormControlLabel,
  Checkbox,
  withStyles,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid
} from '@material-ui/core';
import { get } from 'lodash';
import { connect } from 'formik';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { pathHasError, getErrorLabelForPath } from '../utils/form-utils';
import { width } from '@material-ui/system';

const removeByIndex = (array, index) => {
  const prior = array.slice(0, index);
  const following = array.slice(index + 1);
  return [...prior, ...following];
};

const CheckboxWithFormik = ({
  rawOptions,
  label,
  classes,
  name,
  onChange,
  formik,
  required,
  t
}) => {
  const values = get(formik.values, name) || [];
  const error = pathHasError(name, formik.touched, formik.errors);
  const helperText = getErrorLabelForPath(
    name,
    formik.touched,
    formik.errors,
    t
  );

  const labelProps = { required, error };
  const handleChange = e => {
    const index = values.indexOf(e.target.value);
    if (index === -1) return onChange([...values, e.target.value]);
    return onChange(removeByIndex(values, index));
  };

  return (
    <FormControl className={classes.formContainer}>
      <StyledFormLabel component="legend" {...labelProps}>
        {label}
      </StyledFormLabel>

      <Grid container spacing={1}>
        {rawOptions.map(option => (
          <Grid
            item
            xs={4}
            key={option.value}
            className={classes.gridCentering}
          >
            <FilledFormControlLabel
              control={
                <GreenCheckbox
                  name={name}
                  onChange={e => {
                    handleChange(e);
                  }}
                  checked={values.indexOf(option.value) !== -1}
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

CheckboxWithFormik.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rawOptions: PropTypes.array.isRequired
};

const GreenCheckbox = withStyles(theme => ({
  root: {
    color: '#909090'
  },
  checked: {
    color: theme.palette.primary.main
  }
}))(props => <Checkbox color="default" {...props} />);

const styles = {
  formLabel: {
    color: '#909090',
    marginBottom: 15,
    marginTop: 15
  },
  gridCentering: {
    display: 'flex',
    alignItems: 'center'
  },
  formContainer: {
    width: '100%',
    marginBottom: 20
  }
};

const FilledFormControlLabel = withStyles(() => ({
  root: {
    marginLeft: 0,
    minWidth: '100%',
    paddingRight: 15,
    overflowWrap: 'break-word'
  },
  label: {
    maxWidth: '75%'
  }
}))(props => <FormControlLabel color="default" {...props} />);

const StyledFormLabel = withStyles(() => ({
  root: {
    color: '#909090',
    marginBottom: 15,
    marginTop: 15,
    maxWidth: '100%'
  },
  focused: {
    color: '#909090!important'
  }
}))(props => <FormLabel color="default" {...props} />);

export default withTranslation()(
  connect(withStyles(styles)(CheckboxWithFormik))
);
