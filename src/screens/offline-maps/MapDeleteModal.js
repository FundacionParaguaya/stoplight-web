import { Button, CircularProgress, Modal, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { deleteMap } from '../../api';
import face from '../../assets/serious_face.png';

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

const MapDeleteModal = ({
  open,
  onClose,
  mapToDelete,
  showErrorMessage,
  showSuccessMessage,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [deletingMap, setDeletingMap] = useState(false);

  const onDeleteClicked = () => {
    setDeletingMap(true);
    deleteMap(mapToDelete.id, user)
      .then(() => {
        setDeletingMap(false);
        showSuccessMessage(t('views.offlineMaps.delete.success'));
        onClose(true);
      })
      .catch(e => {
        console.log(e);
        showErrorMessage(t('views.offlineMaps.delete.error'));
        setDeletingMap(false);
        onClose(false);
      });
  };

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <div className={classes.mainContainer}>
        <img src={face} className={classes.icon} alt="Warning icon" />
        <Typography className={classes.title} variant="h5">
          {t('views.offlineMaps.delete.confirmTitle')}
        </Typography>
        <Typography className={classes.subtitle} variant="subtitle1">
          {t('views.offlineMaps.delete.cannotUndo')}
        </Typography>
        <Typography className={classes.areYouSureLabel} variant="h5">
          {t('views.offlineMaps.delete.confirmText')}
        </Typography>
        {deletingMap && (
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
            disabled={deletingMap}
          >
            {t('general.yes')}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onClose(false)}
            disabled={deletingMap}
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

export default connect(mapStateToProps)(MapDeleteModal);
