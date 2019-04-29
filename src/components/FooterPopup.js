import React from 'react';
import { withStyles, Typography, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import Container from './Container';

const DEFAULT_BUTTON_TEXT = 'Got it!';

function FooterPopup(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      {props.isOpen && (
        <div className={classes.container}>
          <Container className={classes.innerContainer}>
            <div>
              <Typography variant="h6" color="textSecondary">
                {props.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {props.description}
              </Typography>
            </div>
            <Button
              variant="contained"
              onClick={props.handleButtonClick}
              className={classes.button}
            >
              <i className={`material-icons ${classes.icon}`}>check</i>
              {props.buttonText || DEFAULT_BUTTON_TEXT}
            </Button>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
}

FooterPopup.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  handleButtonClick: PropTypes.func.isRequired
};

const styles = theme => ({
  container: {
    width: '100%',
    height: 100,
    backgroundColor: theme.palette.primary.main,
    position: 'fixed',
    bottom: 0,
    paddingTop: 20,
    paddingBottom: 20
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    borderRadius: 0,
    height: 50,
    width: 315,
    backgroundColor: theme.palette.text.secondary,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.text.secondary
    },
    span: {
      borderBottom: '0!important'
    }
  },
  icon: {
    fontSize: 20,
    marginRight: 7.5
  }
});

export default withStyles(styles)(FooterPopup);
