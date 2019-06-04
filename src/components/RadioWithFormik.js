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
      <StyledFormLabel component="legend">{label}</StyledFormLabel>
      <StyledRadioGroup value={value}>
        {rawOptions.map(option => (
          <FilledFormControlLabel
            control={<GreenRadio />}
            label={option.text}
            key={option.value}
            value={option.value}
            onChange={handleChange}
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

export default RadioWithFormik;
