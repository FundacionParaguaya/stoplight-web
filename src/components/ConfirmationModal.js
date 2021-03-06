import React from 'react';
import clsx from 'clsx';
import { withStyles, Modal, Typography, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { COLORS } from '../theme';
import { CircularProgress } from '@material-ui/core';

const DEFAULT_CANCEL_TEXT = 'Cancel';
const DEFAULT_CONTINUE_TEXT = 'Continue';

const VARIANTS = {
  WARNING: 'warning',
  SUCCESS: 'success'
};

// See and implementation example on NavIcons
const ConfirmationModal = props => {
  const { classes, variant, disabledFacilitator } = props;

  const titleClass = clsx(classes.confirmationModalTitle, {
    [classes.titleWarning]: variant === VARIANTS.WARNING,
    [classes.titleSuccess]: variant === VARIANTS.SUCCESS
  });

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className={classes.confirmationModal}>
        <Typography
          className={titleClass}
          variant="h5"
          test-id="modal-title"
          // color="error"
        >
          {props.title}
        </Typography>
        <Typography
          className={classes.confirmationModalSubtitle}
          variant="subtitle1"
        >
          {props.subtitle}
        </Typography>
        {disabledFacilitator && <CircularProgress />}
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            test-id="continue"
            color="primary"
            onClick={props.confirmAction}
            disabled={disabledFacilitator}
          >
            {props.continueButtonText || DEFAULT_CONTINUE_TEXT}
          </Button>
          {!props.singleAction && (
            <Button
              className={classes.button}
              variant="outlined"
              onClick={props.onClose}
              disabled={disabledFacilitator}
            >
              {props.cancelButtonText || DEFAULT_CANCEL_TEXT}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

ConfirmationModal.defaultProps = {
  variant: VARIANTS.WARNING
};

const styles = theme => ({
  confirmationModal: {
    width: '90vw',
    height: '80vh',
    maxWidth: 370,
    maxHeight: 330,
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
  titleWarning: {
    color: COLORS.GREEN
  },
  titleSuccess: {
    color: COLORS.GREEN
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  confirmationModalTitle: {
    textAlign: 'center'
  },
  confirmationModalSubtitle: {
    textAlign: 'center'
  }
});

export default withRouter(withStyles(styles)(ConfirmationModal));
