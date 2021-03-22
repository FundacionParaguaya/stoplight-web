import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { deletePriority } from '../../../api';
import face from '../../../assets/serious_face.png';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '85vw',
    maxWidth: 500,
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
}));

const DeletePriorityModal = ({
  open,
  toggleModal,
  afterSubmit,
  user,
  priorityToDelete,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const classes = useStyles();
  const [deletingPriority, setDeletingPriority] = useState(false);
  const { t } = useTranslation();

  const onDeleteClicked = () => {
    setDeletingPriority(true);
    deletePriority(priorityToDelete.id, user)
      .then(() => {
        setDeletingPriority(false);
        onClose({ deleteModalOpen: false });
        enqueueSnackbar(t('views.familyPriorities.delete.success'), {
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
        enqueueSnackbar(t('views.familyPriorities.delete.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setDeletingPriority(false);
        toggleModal();
      });
  };

  const onClose = () => {
    afterSubmit();
    toggleModal();
  };
  return (
    <Modal open={open} onClose={() => toggleModal()}>
      <div className={classes.mainContainer}>
        <img src={face} className={classes.icon} alt="Warning icon" />
        <Typography className={classes.title} variant="h5">
          {t('views.familyPriorities.delete.confirmTitle')}
        </Typography>
        <Typography className={classes.subtitle} variant="subtitle1">
          {t('views.familyPriorities.delete.cannotUndo')}
        </Typography>
        <Typography className={classes.areYouSureLabel} variant="h5">
          {t('views.familyPriorities.delete.confirmText')}
        </Typography>
        {deletingPriority && (
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
            disabled={deletingPriority}
          >
            {t('general.yes')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => toggleModal()}
            disabled={deletingPriority}
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

export default connect(mapStateToProps)(withSnackbar(DeletePriorityModal));
