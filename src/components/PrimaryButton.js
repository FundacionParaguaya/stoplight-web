import React from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';

function PrimaryButton({ children, classes }) {
  return (
    <Button variant="contained" className={classes.primaryButton}>
      {children}
    </Button>
  );
}

PrimaryButton.propTypes = {
  children: PropTypes.string.isRequired
};

const styles = {
  primaryButton: {
    width: 280
  }
};

export default withStyles(styles)(PrimaryButton);
