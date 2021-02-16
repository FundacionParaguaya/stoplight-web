import {
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import { withSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { addOrUpdateHub } from '../../api';

const useStyles = makeStyles(theme => ({
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  },
  confirmationModal: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    minHeight: '35vh',
    maxHeight: '85vh',
    width: '85vw',
    maxWidth: 500,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  input: {
    marginBottom: 10,
    marginTop: 10
  },
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 70,
    paddingBottom: 10,
    borderWidth: 4,
    borderRadius: 2,
    borderColor: theme.palette.grey.quarter,
    borderStyle: 'dashed',
    backgroundColor: theme.palette.grey.light,
    outline: 'none',
    width: '100%'
  },
  img: {
    position: 'absolute',
    width: '40%',
    top: '10%',
    left: '30%',
    backgroundColor: theme.palette.background.default
  },
  icon: {
    fontSize: '8vh',
    color: theme.palette.grey.quarter
  },
  switchOptionsContainer: {
    display: 'flex',
    marginBottom: '1rem',
    marginTop: '1rem',
    justifyContent: 'space-between'
  },
  allowRetake: {
    fontWeight: 400,
    padding: 11,
    paddingLeft: 14,
    font: 'Roboto'
  }
}));

const HubPermissionsModal = ({
  open,
  toggleModal,
  afterSubmit,
  user,
  hub,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const onSubmit = values => {
    let labels = [];

    if (values.allowRetake) {
      labels.push('allowRetake');
    }
    if (values.allowSolutions) {
      labels.push('allowSolutions');
    }
    if (values.interactiveHelp) {
      labels.push('interactiveHelp');
    }
    if (values.projectsSupport) {
      labels.push('projectsSupport');
    }
    if (values.zoomLimit) {
      labels.push('zoomLimit');
    }
    if (values.allowFamilyUsers) {
      labels.push('allowFamilyUsers');
    }
    addOrUpdateHub(user, { ...hub, labels })
      .then(() => {
        onClose(true);
        enqueueSnackbar(t('views.hub.form.save.success'), {
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
        enqueueSnackbar(t('views.hub.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        onClose(true);
      });
  };

  const onClose = submitted => {
    submitted && afterSubmit();
    toggleModal();
  };

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => onClose(false)}
    >
      <div className={classes.confirmationModal}>
        <Typography
          variant="h5"
          test-id="title-bar"
          align="center"
          style={{ marginBottom: 10 }}
        >
          {t('views.hub.form.permissionTitle')}
        </Typography>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>
        <Formik
          initialValues={{
            allowRetake: !!hub.labels && hub.labels.includes('allowRetake'),
            allowSolutions: !!hub.allowSolutions && hub.allowSolutions,
            interactiveHelp:
              !!hub.labels && hub.labels.includes('interactiveHelp'),
            projectsSupport:
              !!hub.projectsSupport && hub.labels.includes('projectsSupport'),
            zoomLimit: !!hub.zoomLimit && hub.labels.includes('zoomLimit'),
            allowFamilyUsers:
              !!hub.labels && hub.labels.includes('allowFamilyUsers')
          }}
          onSubmit={values => {
            onSubmit(values);
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form noValidate>
              <div className={classes.switchOptionsContainer}>
                <Typography variant="subtitle1" className={classes.allowRetake}>
                  {t('views.hub.form.allowRetake')}
                </Typography>
                <Switch
                  name={'allowRetake'}
                  value={'allowRetake'}
                  onChange={e => {
                    setFieldValue('allowRetake', !values.allowRetake);
                  }}
                  checked={values.allowRetake}
                  color="primary"
                />
              </div>
              <div className={classes.switchOptionsContainer}>
                <Typography variant="subtitle1" className={classes.allowRetake}>
                  {t('views.hub.form.allowSolutions')}
                </Typography>
                <Switch
                  name={'allowSolutions'}
                  value={'allowSolutions'}
                  onChange={e => {
                    setFieldValue('allowSolutions', !values.allowSolutions);
                  }}
                  checked={values.allowSolutions}
                  color="primary"
                />
              </div>
              <div className={classes.switchOptionsContainer}>
                <Typography variant="subtitle1" className={classes.allowRetake}>
                  {t('views.hub.form.allowInteractiveHelp')}
                </Typography>
                <Switch
                  name={'allowSolutions'}
                  value={'interactiveHelp'}
                  onChange={e => {
                    setFieldValue('interactiveHelp', !values.interactiveHelp);
                  }}
                  checked={values.interactiveHelp}
                  color="primary"
                />
              </div>
              <div className={classes.switchOptionsContainer}>
                <Typography variant="subtitle1" className={classes.allowRetake}>
                  {t('views.hub.form.allowProjects')}
                </Typography>
                <Switch
                  name={'projectsSupport'}
                  value={'projectsSupport'}
                  onChange={e => {
                    setFieldValue('projectsSupport', !values.projectsSupport);
                  }}
                  checked={values.projectsSupport}
                  color="primary"
                />
              </div>
              <div className={classes.switchOptionsContainer}>
                <Typography variant="subtitle1" className={classes.allowRetake}>
                  {t('views.hub.form.allowMapRestriction')}
                </Typography>
                <Switch
                  name={'zoomLimit'}
                  value={'zoomLimit'}
                  onChange={e => {
                    setFieldValue('zoomLimit', !values.zoomLimit);
                  }}
                  checked={values.zoomLimit}
                  color="primary"
                />
              </div>
              <div className={classes.switchOptionsContainer}>
                <Typography variant="subtitle1" className={classes.allowRetake}>
                  {t('views.hub.form.allowFamilyUsers')}
                </Typography>
                <Switch
                  name={'allowFamilyUsers'}
                  value={'allowFamilyUsers'}
                  onChange={e => {
                    setFieldValue('allowFamilyUsers', !values.allowFamilyUsers);
                  }}
                  checked={values.allowFamilyUsers}
                  color="primary"
                />
              </div>
              {isSubmitting ? (
                <CircularProgress className={classes.loadingContainer} />
              ) : null}
              <div className={classes.buttonContainerForm}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {t('general.save')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(HubPermissionsModal));
