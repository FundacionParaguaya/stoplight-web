import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  withStyles,
  Modal,
  Typography,
  Button,
  CircularProgress
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import InputWithFormik from './InputWithFormik';
import * as Yup from 'yup';

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formModal: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '50px 40px 30px 40px',
    height: 315,
    width: 475,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none',
    justifyContent: 'space-around'
  },
  input: {
    paddingTop: 20,
    paddingBottom: 10
  },
  buttonContainer: {
    paddingTop: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  leaveModalTitle: {
    textAlign: 'center'
  },
  leaveModalSubtitle: {
    textAlign: 'center'
  }
});

const validEmailAddress = 'validation.validEmailAddress';

//Validation criteria
const validationSchema = Yup.object().shape({
  email: Yup.string().email(validEmailAddress)
});

const EmailConfirmationModal = ({
  classes,
  open,
  email,
  onLeave,
  handleSendMail,
  loading
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={() => {}}
      disableEnforceFocus
      disableAutoFocus
    >
      <Formik
        initialValues={{
          email: (!!email && email) || ''
        }}
        validationSchema={validationSchema}
        onSubmit={values => handleSendMail(values.email)}
      >
        {({ values }) => (
          <Form noValidate className={classes.formModal}>
            <Typography variant="h5">
              {t('views.final.confirmYourMail')}
            </Typography>
            <InputWithFormik
              data-testid="email-input"
              label={t('views.final.email')}
              name="email"
              className={classes.input}
            />
            {loading && <CircularProgress />}
            <div className={classes.buttonContainer}>
              <Button
                className={classes.button}
                variant="outlined"
                onClick={onLeave}
                disabled={loading}
              >
                {t('general.cancel')}
              </Button>
              <Button
                className={classes.button}
                variant="outlined"
                color={'primary'}
                disabled={!values.email || loading}
                type="submit"
              >
                {t('general.ok')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default withStyles(styles)(EmailConfirmationModal);
