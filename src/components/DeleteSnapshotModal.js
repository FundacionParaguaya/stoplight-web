import React, { useState } from 'react';
import {
  Modal,
  Typography,
  Button,
  CircularProgress,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

//import face from '../../assets/serious_face.png';
import face from '../assets/serious_face.png';
import { snapshots } from '../redux/reducers';

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
    width: 55
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(1.5),
    color: theme.palette.grey.middle,
    fontSize: '24px'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: theme.palette.grey.main,
    fontSize: 14
  },
  areYouSureLabel: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: theme.typography.h4.color,
    fontSize: 14,
    lineHeight: '20px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3)
  }
});

const DeleteSnapshotModal = ({
  open,
  onClose,
  user,
  snapshot,
  enqueueSnackbar,
  closeSnackbar,
  afterSubmit,
  classes
}) => {
  const [deletingSnapshot, setDeletingSnapShot] = useState(false);
  const { t } = useTranslation();

  const onDeleteClicked = () => {
    /*  setDeletingSnapShot(true);
    deleteSnapShot(user, snapshot.id)
      .then(() => {
        setDeletingSnapShot(false);
        onClose({ deleteModalOpen: false });
        //afterSubmit();
        enqueueSnackbar(t('views.final.delete.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.final.delete.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setDeletingSnapshotfalse);
        onClose();
      }); */
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <div className={classes.mainContainer}>
        <img src={face} className={classes.icon} alt="Warning icon" />
        <Typography className={classes.title} variant="h5">
          {t('views.final.delete.confirmTitle')}
        </Typography>
        <Typography className={classes.subtitle} variant="subtitle1">
          {t('views.final.delete.cannotUndo')}
        </Typography>
        <Typography className={classes.areYouSureLabel} variant="h5">
          {t('views.final.delete.confirmText')}
        </Typography>
        {deletingSnapshot && (
          <div className={classes.loadingContainer}>
            <CircularProgress size={50} thickness={2} />
          </div>
        )}
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={onDeleteClicked}
            disabled={deletingSnapshot}
          >
            {t('general.yes')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onClose()}
            disabled={deletingSnapshot}
          >
            {t('general.no')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default withStyles(styles)(
  connect(mapStateToProps)(withSnackbar(DeleteSnapshotModal))
);
