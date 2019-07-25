import React from 'react';
import { withStyles, Button } from '@material-ui/core';

const GreyButton = ({ children, className, classes, ...props }) => (
  <Button className={`${classes.button} ${className}`} {...props}>
    {children}
  </Button>
);

const styles = theme => ({
  button: {
    textDecoration: 'none',
    fontSize: 14,
    color: theme.palette.grey.middle,
    padding: `${theme.spacing(1.75)}px ${theme.spacing(5)}px`,
    lineHeight: 1,
    textTransform: 'capitalize',
    backgroundColor: '#FAFBFC',
    borderRadius: 2,
    border: '0.5px solid #D8D2D2',
    '&:hover': {
      textDecoration: 'none'
    },
    '&::after, &::before': {
      display: 'none'
    }
  }
});

export default withStyles(styles)(GreyButton);
