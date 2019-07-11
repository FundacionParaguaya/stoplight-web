import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

function Footer(props) {
  const { classes } = props;

  return (
    <div className={classes.footer}>
      <Typography className={classes.footerText}>
        ©Copyright 2019 - Spotlight Desktop 1.2.2
      </Typography>
    </div>
  );
}

const styles = {
  footer: {
    width: '100%',
    height: '40px',
    backgroundColor: '#fff',
    borderTop: '1px solid #DCDEE3',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingLeft: 20
  },
  footerText: {
    fontSize: 12
  }
};

export default withStyles(styles)(Footer);
