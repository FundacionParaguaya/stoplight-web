import React, { useState } from 'react';
import {
  FormControlLabel,
  Radio,
  withStyles,
  FormControl,
  RadioGroup,
  FormLabel
} from '@material-ui/core';

const RadioWithFormik = ({ label, rawOptions }) => {
  const [value, setValue] = useState();

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup value={value}>
        {rawOptions.map(option => (
          <FilledFormControlLabel
            control={<GreenRadio />}
            label={option.text}
            key={option.value}
            value={option.value}
            onChange={handleChange}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const FilledFormControlLabel = withStyles(() => ({
  root: {
    background: '#F3F4F6',
    marginLeft: 0,
    minWidth: 130,
    paddingRight: 30,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10
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

export default RadioWithFormik;
