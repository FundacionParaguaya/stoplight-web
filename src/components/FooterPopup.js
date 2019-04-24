import React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import Container from './Container';

function FooterPopup(props) {
  const { classes } = props;

  return (
    <div className={classes.container}>
      <Container>
        <div>
          <Typography variant="h6" color="textSecondary">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {props.description}
          </Typography>
        </div>
      </Container>
    </div>
  );
}

const styles = theme => ({
  container: {
    width: '100%',
    height: 100,
    backgroundColor: theme.palette.primary.main,
    position: 'fixed',
    bottom: 0,
    paddingTop: 20,
    paddingBottom: 20
  }
});

export default withStyles(styles)(FooterPopup);
