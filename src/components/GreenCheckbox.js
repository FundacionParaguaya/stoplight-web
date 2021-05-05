import React from 'react';
import { Checkbox, withStyles } from '@material-ui/core';

const GreenCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.grey.main
  },
  checked: {
    color: theme.palette.primary.main
  }
}))(props => <Checkbox color={'default'} {...props} />);

export default GreenCheckbox;
