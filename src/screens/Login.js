import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Typography, Button, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import logo from '../assets/header_logo.png';
import { connect } from 'react-redux';
import {
  getToken,
  resetPasswordService,
  changePassword,
  enviroments
} from '../api';
import { getHomePage } from '../utils/role-utils';
import { withSnackbar } from 'notistack';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    width: 400
  },
  title: {
    marginTop: 20,
    lineHeight: 1.2,
    textAlign: 'left'
  },
  label: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'left',
    color: theme.palette.grey.middle
  },
  link: {
    color: theme.palette.grey.middle
  },
  textField: {
    marginTop: 4,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: '2px',
        border: '1.5px solid #309E43'
      },
      '&:hover fieldset': {
        borderRadius: '2px',
        border: '1.5px solid #309E43'
      }
    }
  },
  inputLabel: {
    marginTop: 10,
    color: theme.palette.grey.middle,
    fontWeight: 500
  },
  filterInput: {
    height: 25,
    paddingTop: '12.0px!important',
    paddingBottom: '12.0px!important',
    paddingRight: '14px!important',
    paddingLeft: '14px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 30
  },
  forgotPassword: {
    color: theme.palette.primary.dark,
    fontSize: 14,
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: 12
  },
  alert: {
    '& .MuiAlert-action': {
      paddingLeft: 0
    },
    '& .MuiAlert-message': {
      fontSize: 15
    },
    '& .MuiAlert-icon': {
      marginRight: 0
    }
  }
}));

const Login = ({ env, enqueueSnackbar, closeSnackbar }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const id = urlParams.get('id');

  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //Validation criterias
  const validationSchema = Yup.object().shape({
    /* 
                password: Yup.string()
                    .when('other', (other, schema) =>
                        resetPassword ? schema : schema.required(fieldIsRequired)),
                email: Yup.string()
                    .matches(
                        // eslint-disable-next-line
                        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                        t('views.user.form.emailNotValid'))
                    .when('other', (other, schema) =>
                        resetPassword ? schema.required(fieldIsRequired) : schema), */
  });

  const onSubmit = values => {
    const formData = new FormData();

    if (resetPassword) {
      formData.set('username', values.username);
      formData.set('email', values.email);

      resetPasswordService(formData, env)
        .then(() => {
          enqueueSnackbar(t('views.login.mailResetSuccess'), {
            variant: 'success',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        })
        .catch(error => setErrorMessage(error.response.data.message))
        .finally(() => setLoading(false));
    } else if (!!token && !!id) {
      formData.set('password', values.newPassword);
      formData.set('repeatPassword', values.newPasswordConfirm);
      formData.set('token', token);
      formData.set('userId', id);

      changePassword(formData, env)
        .then(() => {
          enqueueSnackbar(t('views.login.passwordReseted'), {
            variant: 'success',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
          window.location.replace(enviroments[env] + '/login');
        })
        .catch(() => setErrorMessage(t('views.login.newPasswordConfirmFailed')))
        .finally(() => setLoading(false));
    } else {
      formData.set('username', values.username);
      formData.set('password', values.password);
      formData.set('grant_type', 'password');
      getToken(formData, env)
        .then(response => {
          localStorage.setItem(
            'persist:root',
            JSON.stringify({
              currentDraft: 'null',
              currentSurvey: 'null',
              hydration: 'false',
              snapshots: '[]',
              user: JSON.stringify({
                token: response.data.access_token,
                refreshTokenFromStorage: response.data.refresh_token,
                env: env,
                ...response.data.user
              }),
              _persist: JSON.stringify({ version: -1, rehydrated: true })
            })
          );
          let url =
            enviroments[env] +
            '/' +
            getHomePage(response.data.user.authorities[0].authority);

          window.location.replace(url);
        })
        .catch(error => {
          let errorMessage = error.toString().includes('401')
            ? t('views.login.wrongCredentials')
            : t('views.login.connectionError');

          setErrorMessage(errorMessage);
        })
        .finally(() => setLoading(false));
    }
  };

  const getRedirect = env => {
    let platform = env === 'platform' ? 'demo' : 'platform';
    return (
      <a href={`https://${platform}.povertystoplight.org/`}>
        <Typography variant="subtitle2" className={classes.link}>
          {platform}
        </Typography>
      </a>
    );
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.form}>
        <img
          style={{ marginTop: 4 }}
          src={logo}
          alt="Stoplight Logo"
          width={54}
          height={54}
        />

        <Typography variant="h4" className={classes.title}>
          {t('views.login.welcomeToPlatform')}
        </Typography>
        <div style={{ display: 'flex' }}>
          <Typography
            variant="subtitle2"
            className={classes.label}
            style={{ marginRight: 3 }}
          >
            {t('views.login.switchTo')}
          </Typography>
          <Typography variant="subtitle2" className={classes.label}>
            {getRedirect(env)}
          </Typography>
        </div>

        {!!errorMessage && (
          <Alert
            onClose={() => setErrorMessage('')}
            icon={<div />}
            severity="error"
            variant="filled"
            className={classes.alert}
          >
            {errorMessage}
          </Alert>
        )}

        {resetPassword && (
          <Typography variant="subtitle2" className={classes.label}>
            {t('views.login.resetTitle')}
          </Typography>
        )}
        <Formik
          initialValues={{
            username: '',
            password: '',
            email: '',
            newPassword: '',
            newPasswordConfirm: ''
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            setLoading(true);
            onSubmit(values);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form noValidate>
              {!!token && !!id ? (
                <React.Fragment>
                  <Typography variant="h6" className={classes.inputLabel}>
                    {t('views.login.newPassword')}
                  </Typography>
                  <TextField
                    InputProps={{
                      classes: {
                        input: classes.filterInput
                      }
                    }}
                    variant="outlined"
                    margin="dense"
                    name="newPassword"
                    type="password"
                    value={values.newPassword}
                    onChange={e => setFieldValue('newPassword', e.target.value)}
                    fullWidth
                    className={classes.textField}
                    required={true}
                  />
                  <Typography variant="h6" className={classes.inputLabel}>
                    {t('views.login.newPasswordConfirm')}
                  </Typography>
                  <TextField
                    InputProps={{
                      classes: {
                        input: classes.filterInput
                      }
                    }}
                    variant="outlined"
                    margin="dense"
                    type="password"
                    name="newPasswordConfirm"
                    value={values.newPasswordConfirm}
                    onChange={e =>
                      setFieldValue('newPasswordConfirm', e.target.value)
                    }
                    fullWidth
                    className={classes.textField}
                    required={true}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography variant="h6" className={classes.inputLabel}>
                    {t('views.login.username')}
                  </Typography>
                  <TextField
                    InputProps={{
                      classes: {
                        input: classes.filterInput
                      }
                    }}
                    variant="outlined"
                    margin="dense"
                    name="username"
                    value={values.username}
                    onChange={e => setFieldValue('username', e.target.value)}
                    fullWidth
                    className={classes.textField}
                    required={true}
                  />

                  <Typography variant="h6" className={classes.inputLabel}>
                    {resetPassword
                      ? t('views.login.email')
                      : t('views.login.password')}
                  </Typography>

                  {resetPassword ? (
                    <TextField
                      InputProps={{
                        classes: {
                          input: classes.filterInput
                        }
                      }}
                      variant="outlined"
                      margin="dense"
                      id="email"
                      value={values.email}
                      onChange={e => setFieldValue('email', e.target.value)}
                      fullWidth
                      className={classes.textField}
                      required={true}
                    />
                  ) : (
                    <TextField
                      InputProps={{
                        classes: {
                          input: classes.filterInput
                        }
                      }}
                      variant="outlined"
                      margin="dense"
                      id="password"
                      type="password"
                      value={values.password}
                      onChange={e => setFieldValue('password', e.target.value)}
                      fullWidth
                      className={classes.textField}
                      required={true}
                    />
                  )}
                </React.Fragment>
              )}

              <div className={classes.buttonContainerForm}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={loading}
                >
                  {resetPassword || (!!token && !!id)
                    ? t('views.login.resetPassword')
                    : t('views.login.login')}
                </Button>
                <span
                  className={classes.forgotPassword}
                  onClick={() => setResetPassword(!resetPassword)}
                >
                  {resetPassword
                    ? t('views.login.backLogin')
                    : t('views.login.forgotPassword')}
                </span>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(Login));
