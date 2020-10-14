import React, { useState } from 'react';
import { Formik } from 'formik';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { Modal, CircularProgress, Typography } from '@material-ui/core';

const ProjectFormModal = ({
  open,
  toggleModal,
  afterSubmit,
  project,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const isCreate = !project.id;
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const onClose = submitted => {
    submitted && afterSubmit();
    toggleModal();
  };
  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      onClose={() => onClose(false)}
      className={classes.modal}
    >
      {loading ? (
        <div className={classes.confirmationModal}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.confirmationModal}>
          <Typography variant="h5" align="center">
            {isCreate
              ? t('views.projects.form.addTitle')
              : t('views.projects.form.editTitle')}
          </Typography>
        </div>
      )}
    </Modal>
  );
};

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  confirmationModal: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    maxHeight: '65vh',
    width: '500px',
    overflow: 'auto',
    position: 'relative',
    outline: 'none'
  }
}));

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(ProjectFormModal));
