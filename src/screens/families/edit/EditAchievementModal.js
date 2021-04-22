import { Button, CircularProgress, Modal, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { editAchievement } from '../../../api';
import InputWithFormik from '../../../components/InputWithFormik';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmationModal: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    maxHeight: '95vh',
    width: '85vw',
    maxWidth: 500,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      padding: '40px 30px'
    }
  },
  buttonContainerForm: {
    display: 'flex',
    marginTop: 40,
    justifyContent: 'space-evenly'
  },
  typographyStyle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
      lineHeight: 1.2
    }
  },
  extraTitleText: {
    textAlign: 'center',
    fontWeight: 400,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 10,
    lineHeight: '25px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14,
      lineHeight: 1.2
    }
  }
}));

const EditAchievementModal = ({
  open,
  toggleModal,
  afterSubmit,
  user,
  achievementToEdit,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    toggleModal();
  };

  const onClose = () => {
    toggleModal();
  };

  // on edit achievement
  const onEditAchievement = values => {
    editAchievement(user, values.id, values.action, values.roadmap)
      .then(response => {
        onClose({ deleteModalOpen: false });
        let updatedValues = values;
        updatedValues['indicator'] = achievementToEdit.indicator;
        updatedValues['snapshotStoplightId'] =
          achievementToEdit.snapshotStoplightId;
        afterSubmit(updatedValues);
        enqueueSnackbar(t('views.familyAchievements.achievementSaved'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        // setOpen(false);
        enqueueSnackbar(t('views.familyAchievements.errorSaving'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  const fieldIsRequired = 'validation.fieldIsRequired';

  const validationSchema = Yup.object().shape({
    action: Yup.string().required(fieldIsRequired)
  });
  return (
    <Modal open={open} onClose={() => toggleModal()} className={classes.modal}>
      {loading ? (
        <div className={classes.confirmationModal}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.confirmationModal}>
          <Typography
            variant="h4"
            test-id="title-bar"
            align="center"
            className={classes.typographyStyle}
          >
            {!!achievementToEdit ? achievementToEdit.indicator : ''}
          </Typography>
          <Formik
            initialValues={{
              id: !!achievementToEdit ? achievementToEdit.id : '',
              action: !!achievementToEdit ? achievementToEdit.action : '',
              roadmap: !!achievementToEdit ? achievementToEdit.roadmap : ''
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              setLoading(true);
              onEditAchievement(values);
            }}
          >
            <Form>
              <InputWithFormik
                label={t('views.lifemap.whatDidItTakeToAchieveThis')}
                name="action"
              />
              <InputWithFormik
                label={t('views.lifemap.howDidYouGetIt')}
                name="roadmap"
              />
              <div className={classes.buttonContainerForm}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >
                  {t('general.save')}
                </Button>

                <Button
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                >
                  {t('general.cancel')}
                </Button>
              </div>
            </Form>
          </Formik>
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(EditAchievementModal));
