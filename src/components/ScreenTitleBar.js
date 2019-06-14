import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

const ScreenTitleBar = ({ classes, title, subtitle }) => {
  return (
    <div className={classes.container}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="h6">{subtitle || ''}</Typography>
    </div>
  );
};

const styles = {
  container: {
    padding: '60px 0'
  }
};

export default withStyles(styles)(ScreenTitleBar);
