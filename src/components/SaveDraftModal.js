import React, { useState } from 'react';
import {
  withStyles,
  Modal,
  Typography,
  Button,
  CircularProgress,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveDraft } from '../api';
import face from '../assets/serious_face.png';

const SaveDraftModal = props => {
  const { classes, open, onClose, currentDraft, user, history } = props;
  const [savingDraft, setSavingDraft] = useState(false);
  const { t } = useTranslation();
  const onSaveClicked = () => {
    setSavingDraft(true);
    saveDraft(user, {
      ...currentDraft,
      lifemapNavHistory: JSON.stringify(currentDraft.lifemapNavHistory || [])
    })
      .then(() => {
        history.push('/surveys');
      })
      .catch(() => {
        props.enqueueSnackbar(t('views.saveDraftModal.cannotSave'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => props.closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        onClose();
      })
      .finally(() => setSavingDraft(false));
  };
  return (
    <Modal open={open} onClose={savingDraft ? null : onClose}>
      <div className={classes.mainContainer}>
        <img src={face} className={classes.icon} alt="Warning icon" />
        <Typography className={classes.title} variant="h5">
          {t('views.saveDraftModal.lifemapNotComplete')}
        </Typography>
        <Typography className={classes.subtitle} variant="subtitle1">
          {t('views.saveDraftModal.willSaveDraft')}
        </Typography>
        <Typography className={classes.exitLabel} variant="h5">
          {t('views.saveDraftModal.sureWantToExit')}
        </Typography>
        {savingDraft && (
          <div className={classes.loadingContainer}>
            <CircularProgress size={50} thickness={2} />
          </div>
        )}
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={onSaveClicked}
            disabled={savingDraft}
          >
            {t('general.yes')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
            disabled={savingDraft}
          >
            {t('general.no')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const styles = theme => ({
  mainContainer: {
    width: 470,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '35px 50px'
  },
  button: {
    marginRight: theme.spacing(2)
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    width: '55px'
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(1.5),
    color: '#6A6A6A',
    fontSize: '24px'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: '#909090',
    fontSize: '14px'
  },
  exitLabel: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: '#626262',
    fontSize: '14px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3)
  }
});

const mapStateToProps = ({ currentDraft, currentSurvey, user }) => ({
  currentDraft,
  currentSurvey,
  user
});
const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(withSnackbar(SaveDraftModal)))
);
