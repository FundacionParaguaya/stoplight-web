import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'formik';
import * as _ from 'lodash';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { getErrorLabelForPath, pathHasError } from '../utils/form-utils';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    '& .MuiInputBase-input': {
      padding: '12px 12px 10px!important'
    }
  },
  label: { marginRight: 10, marginBottom: 10, fontSize: 14 },
  field: { width: '-webkit-max-content' },
  outlinedInputContainer: {
    marginBottom: 20
  },
  outlinedInput: {}
}));

const InputWithLabel = ({ title, multiline, inputProps, formik, name, t }) => {
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
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className={classes.label}>
        {title}
      </Typography>
      <OutlinedInput
        name={name}
        classes={{
          root: classes.outlinedInputContainer,
          input: classes.outlinedInput
        }}
        placeholder={helperText}
        multiline={multiline}
        value={value}
        inputProps={inputProps}
        onChange={onChange}
        onBlur={onBlur}
        fullWidth={true}
        margin="dense"
        error={error}
      />
    </div>
  );
};

export default connect(InputWithLabel);
