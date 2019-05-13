import React from 'react';
import { withStyles, Modal, Typography, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import redExclamation from '../assets/red_exclamation.png';

const DEFAULT_CANCEL_TEXT = 'Cancel';
const DEFAULT_CONTINUE_TEXT = 'Continue';

const LeaveModal = props => {
  const { classes } = props;

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className={classes.leaveModal}>
        <img src={redExclamation} alt="Red Exclamation" />
        <Typography
          className={classes.leaveModalTitle}
          variant="h5"
          color="error"
        >
          {props.title}
        </Typography>
        <Typography className={classes.leaveModalSubtitle} variant="subtitle1">
          {props.subtitle}
        </Typography>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            onClick={props.leaveAction}
          >
            {props.continueButtonText || DEFAULT_CONTINUE_TEXT}
          </Button>
          {!props.singleAction && (
            <Button
              className={classes.button}
              variant="outlined"
              onClick={props.onClose}
            >
              {props.cancelButtonText || DEFAULT_CANCEL_TEXT}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

const styles = theme => ({
  leaveModal: {
    width: 370,
    height: 330,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    padding: '25px 40px'
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  leaveModalTitle: {
    textAlign: 'center'
  },
  leaveModalSubtitle: {
    textAlign: 'center'
  }
});

export default withRouter(withStyles(styles)(LeaveModal));
