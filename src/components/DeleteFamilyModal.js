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
import { connect } from 'react-redux';
import { deleteFamily } from '../api';
import face from '../assets/serious_face.png';

const DeleteFamilyModal = props => {
  const {
    classes,
    open,
    onClose,
    user,
    family,
    tableRef,
    resetSelection
  } = props;
  const [deletingDraft, setDeletingDraft] = useState(false);
  const { t } = useTranslation();
  const onDeleteClicked = () => {
    setDeletingDraft(true);
    deleteFamily(user, family)
      .then(() => {
        setDeletingDraft(false);
        resetSelection();
        tableRef.current.onQueryChange();
        onClose();
      })
      .catch(e => {
        console.log(e);
        props.enqueueSnackbar(t('views.deleteFamily.cannotDelete'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => props.closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        onClose();
        setDeletingDraft(false);
      });
  };
  return (
    <Modal open={open} onClose={deletingDraft ? null : onClose}>
      <div className={classes.mainContainer}>
        <img src={face} className={classes.icon} alt="Warning icon" />
        <Typography className={classes.title} variant="h5">
          {t('views.deleteFamily.confirmDeletion')}
        </Typography>
        <Typography className={classes.subtitle} variant="subtitle1">
          {t('views.deleteFamily.cannotUndo')}
        </Typography>
        <Typography className={classes.areYouSureLabel} variant="h5">
          {t('views.deleteFamily.areYouSure')}
        </Typography>
        {deletingDraft && (
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
            disabled={deletingDraft}
          >
            {t('general.yes')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
            disabled={deletingDraft}
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
  areYouSureLabel: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
    color: '#626262',
    fontSize: '14px',
    lineHeight: '20px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3)
  }
});

const mapStateToProps = ({ user }) => ({
  user
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withSnackbar(DeleteFamilyModal)));
