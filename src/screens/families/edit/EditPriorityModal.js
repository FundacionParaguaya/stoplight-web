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
import { editPriority } from '../../../api';
import InputWithFormik from '../../../components/InputWithFormik';
import AutocompleteWithFormik from '../../../components/AutocompleteWithFormik';
import { constructEstimatedMonthsOptions } from '../../../utils/form-utils';

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
    width: '500px',
    overflowY: 'auto',
    position: 'relative',
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 24,
      marginRight: 24
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

const EditPriorityModal = ({
  open,
  toggleModal,
  afterSubmit,
  user,
  priorityToEdit,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const monthsOptions = constructEstimatedMonthsOptions(t);
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    toggleModal();
  };

  const onClose = () => {
    afterSubmit();
    toggleModal();
  };

  // on edit priority
  const onEditPriority = values => {
    editPriority(
      user,
      values.id,
      values.reason,
      values.action,
      values.estimatedDate
    )
      .then(response => {
        onClose({ deleteModalOpen: false });
        enqueueSnackbar(t('views.familyPriorities.prioritySaved'), {
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
        enqueueSnackbar(t('views.familyPriorities.errorSaving'), {
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
    estimatedDate: Yup.string().required(fieldIsRequired)
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
            {!!priorityToEdit ? priorityToEdit.indicator : ''}
          </Typography>
          <Formik
            initialValues={{
              id: !!priorityToEdit ? priorityToEdit.id : '',
              reason: !!priorityToEdit ? priorityToEdit.reason : '',
              action: !!priorityToEdit ? priorityToEdit.action : '',
              estimatedDate: !!priorityToEdit ? priorityToEdit.months : null
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              setLoading(true);
              onEditPriority(values);
            }}
          >
            <Form>
              <InputWithFormik
                label={t('views.lifemap.whyDontYouHaveIt')}
                name="reason"
              />
              <InputWithFormik
                label={t('views.lifemap.whatWillYouDoToGetIt')}
                name="action"
              />
              <AutocompleteWithFormik
                label={t('views.lifemap.howManyMonthsWillItTake')}
                name="estimatedDate"
                rawOptions={monthsOptions}
                labelKey="label"
                valueKey="value"
                required
                isClearable={false}
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

export default connect(mapStateToProps)(withSnackbar(EditPriorityModal));
