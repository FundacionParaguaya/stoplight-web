import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Formik, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import logo from '../assets/header_logo.png';
import {
  getToken,
  resetPasswordService,
  changePassword,
  enviroments
} from '../api';
import { getHomePage } from '../utils/role-utils';
import LanguageSelector from '../components/LanguageSelector';
import Intercom from '../components/Intercom';
import Container from '../components/Container';
import 'url-search-params-polyfill';
import { Globals } from '../theme';

const useStyles = makeStyles(theme => ({
  screen: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  mainContainer: {
    backgroundColor: theme.palette.background.default,
    flex: 1,
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto'
  },
  sideContainers: {
    display: 'flex',
    justifyContent: 'flex-start',
    height: '100vh',
    width: '40vw',
    alignItems: 'flex-end',
    padding: 10,
    paddingBottom: 15
  },
  form: {
    width: 425
  },
  title: {
    marginTop: 20,
    fontSize: 32,
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
        border: `1.5px solid ${theme.palette.primary.main}`
      },
      '&:hover fieldset': {
        borderRadius: '2px',
        border: `1.5px solid ${theme.palette.primary.main}`
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
    textAlign: 'right',
    fontSize: 14,
    cursor: 'pointer',
    textDecoration: 'underline',
    display: 'flex',
    alignItems: 'center',
    marginTop: 0
  },
  button: {
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content'
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
  },
  selectorContainer: {
    position: 'absolute',
    bottom: '25px',
    left: '5px'
  },
  footer: {
    flip: false,
    position: 'relative',
    height: '75px',
    display: 'flex',
    alignItems: 'center'
  }
}));

const Login = ({ env, enqueueSnackbar, closeSnackbar }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const id = urlParams.get('id');
  const initialStatus = {
    username: '',
    password: '',
    email: '',
    newPassword: '',
    newPasswordConfirm: ''
  };

  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    !!errorMessage && setTimeout(() => setErrorMessage(''), 6000);
  }, [errorMessage]);

  const onSubmit = (values, { resetForm }) => {
    setLoading(true);
    const formData = new FormData();

    if (resetPassword) {
      formData.set('username', values.username);
      formData.set('email', values.email);

      resetPasswordService(formData, env)
        .then(() => {
          resetForm(initialStatus);
          enqueueSnackbar(t('views.login.mailResetSuccess'), {
            variant: 'success',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        })
        .catch(() => {
          resetForm(initialStatus);
          setErrorMessage(t('views.login.mailNotFound'));
        })
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
          setTimeout(
            () => window.location.replace(enviroments[env] + '/login'),
            1000
          );
        })
        .catch(() => {
          resetForm(initialStatus);
          setErrorMessage(t('views.login.newPasswordConfirmFailed'));
        })
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
          resetForm(initialStatus);
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

  const handleBackToLogin = changePassword => {
    changePassword && window.location.replace(enviroments[env] + '/login');
    !changePassword && setResetPassword(!resetPassword);
  };

  return (
    <div className={classes.screen}>
      <div />
      <Container className={classes.mainContainer}>
        <div className={classes.form}>
          <img
            style={{ marginTop: 4 }}
            src={logo}
            alt="Stoplight Logo"
            width={54}
            height={54}
          />

          <Typography variant="h4" className={classes.title}>
            {env === 'platform'
              ? t('views.login.welcomeToPlatform')
              : t('views.login.welcomeToDemo')}
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
          <Formik initialValues={initialStatus} onSubmit={onSubmit}>
            {({ setFieldValue, values }) => (
              <Form noValidate>
                {!!token && !!id ? (
                  <React.Fragment>
                    <Typography variant="h6" className={classes.inputLabel}>
                      {t('views.login.newPassword').toUpperCase()}
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
                      onChange={e =>
                        setFieldValue('newPassword', e.target.value)
                      }
                      fullWidth
                      className={classes.textField}
                      required={true}
                    />
                    <Typography variant="h6" className={classes.inputLabel}>
                      {t('views.login.newPasswordConfirm').toUpperCase()}
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
                      {t('views.login.username').toUpperCase()}
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
                        ? t('views.login.email').toUpperCase()
                        : t('views.login.password').toUpperCase()}
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
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        variant="outlined"
                        margin="dense"
                        id="password"
                        type={showPassword ? null : 'password'}
                        value={values.password}
                        onChange={e =>
                          setFieldValue('password', e.target.value)
                        }
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
                    size="large"
                    className={classes.button}
                    disabled={loading}
                  >
                    {resetPassword || (!!token && !!id)
                      ? t('views.login.resetPassword')
                      : t('views.login.login')}
                  </Button>
                  <span
                    className={classes.forgotPassword}
                    onClick={() => handleBackToLogin(!!id)}
                  >
                    {resetPassword || (!!token && !!id)
                      ? t('views.login.backLogin')
                      : t('views.login.forgotPassword')}
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
      <div
        className={classes.footer}
        style={
          Globals.direction === 'ltr'
            ? { justifyContent: 'flex-start' }
            : { justifyContent: 'flex-end' }
        }
      >
        <LanguageSelector />
        <Intercom />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(Login));
