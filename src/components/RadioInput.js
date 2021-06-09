import { FormControlLabel, Radio, withStyles } from '@material-ui/core';
import React from 'react';

const RadioInput = ({ value, label, currentValue, ...props }) => (
  <FilledFormControlLabel
    control={<GreenRadio checked={currentValue === value} {...props} />}
    label={label}
    value={value}
  />
);

const FilledFormControlLabel = withStyles(() => ({
  root: {
    marginLeft: 0,
    minWidth: '100%',
    borderRadius: 50,
    minHeight: 37,
    marginTop: 10
  }
}))(props => <FormControlLabel color={'primary'} {...props} />);

const GreenRadio = withStyles(theme => ({
  root: {
    color: theme.palette.grey.main
  },
  checked: {
    color: theme.palette.primary.main
  }
}))(props => <Radio color={'primary'} {...props} />);

export default RadioInput;
