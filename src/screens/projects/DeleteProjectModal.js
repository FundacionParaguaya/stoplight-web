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
import face from '../../assets/serious_face.png';
import { deleteProject } from '../../api';

const DeleteProjectModal = ({
  open,
  toggleModal,
  afterSubmit,
  user,
  project,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const classes = useStyles();
  const [deletingProject, setDeletingProject] = useState(false);
  const { t } = useTranslation();

  const onDeleteClicked = () => {
    setDeletingProject(true);

    deleteProject(user, project.id)
      .then(() => {
        setDeletingProject(false);
        onClose({ deleteModalOpen: false });
        enqueueSnackbar(t('views.projects.delete.success'), {
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
        enqueueSnackbar(t('views.projects.delete.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setDeletingProject(false);
        onClose();
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
          {t('views.projects.delete.confirmTitle')}
        </Typography>
        <Typography className={classes.subtitle} variant="subtitle1">
          {t('views.projects.delete.cannotUndo')}
        </Typography>
        <Typography className={classes.areYouSureLabel} variant="h5">
          {t('views.projects.delete.confirmText')}
        </Typography>
        {deletingProject && (
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
            disabled={deletingProject}
          >
            {t('general.yes')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => toggleModal()}
            disabled={deletingProject}
          >
            {t('general.no')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  mainContainer: {
    width: '85vw',
    maxWidth: 500,
    backgroundColor: theme.palette.background.default,
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '35px 50px'
  },
  icon: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    width: 55
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3)
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginRight: theme.spacing(2)
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
  }
}));

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(DeleteProjectModal));
