import React from 'react';
import { withStyles, Modal, Typography, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { upsertSnapshot } from '../redux/actions';
import { SNAPSHOTS_STATUS } from '../redux/reducers';
import face from '../assets/serious_face.png';

// See and implementation example on NavIcons
const SaveDraftModal = props => {
  const { classes, open, onClose, currentDraft, match } = props;
  const { t } = useTranslation();
  const addDraftToSnapshots = () => {
    // Before adding the draft to the snapshots list, we make sure to add information
    // about the screen where the user left, and we set the status to DRAFT
    const draft = {
      ...currentDraft,
      status: SNAPSHOTS_STATUS.DRAFT,
      currentScreen: match.url
    };
    props.upsertSnapshot(draft);
    props.history.push('/surveys');
  };
  return (
    <Modal open={open} onClose={onClose}>
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
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={addDraftToSnapshots}
          >
            {t('general.yes')}
          </Button>
          <Button variant="outlined" color="primary" onClick={onClose}>
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
  }
});

const mapStateToProps = ({ currentDraft, currentSurvey }) => ({
  currentDraft,
  currentSurvey
});
const mapDispatchToProps = { upsertSnapshot };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(SaveDraftModal))
);
