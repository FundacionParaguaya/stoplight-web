import {
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
  withStyles
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { addOrUpdateUser, checkUserName, getUserById } from '../../api';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import ExitModal from '../../components/ExitModal';
import InputWithFormik from '../../components/InputWithFormik';
import ProjectsSelector from '../../components/selectors/ProjectsSelector';
import { capitalize } from '../../utils/form-utils';

import {
  checkAccessToProjects,
  ROLES_NAMES,
  checkAccessToFamilyUsers
} from '../../utils/role-utils';
import UserOrgSelector from './form/UserOrgsSelector';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBody: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '40px 50px',
    minHeight: '35vh',
    height: '85vh',
    width: '85vw',
    maxWidth: 500,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  activeContainer: {
    display: 'flex',
    marginBottom: '1rem',
    marginTop: '1rem'
  },
  active: {
    fontWeight: 400,
    padding: 11,
    paddingLeft: 14,
    font: 'Roboto'
  },
  nameField: {
    marginBottom: 10,
    marginTop: 10,
    '& .MuiFilledInput-root.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    },
    '& .MuiInputBase-input': {
      textTransform: 'capitalize'
    }
  }
}));

const GreenCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.grey.main
  },
  checked: {
    color: theme.palette.primary.main
  }
}))(props => <Checkbox color={'default'} {...props} />);

const UserFormModal = ({
  open,
  toggleModal,
  afterSubmit,
  user,
  userId,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const isEdit = !!userId;
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});
  const [usernameChanged, setUsernameChanged] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const fieldIsRequired = 'validation.fieldIsRequired';

  // Validation criterias
  const validationSchema = Yup.object({
    username: Yup.string()
      .required(fieldIsRequired)
      .when('other', (other, schema) =>
        isEdit
          ? schema
          : schema
              .matches(
                /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/,
                t('views.user.form.usernameInvalid')
              )
              .test('username', t('views.user.form.usernameUsed'), value => {
                // Sadly yup triggers validation on every keystroke in the form currently there it's an open issue on the
                // library repo to solve that bug, so doing this check becomes necessary to avoid spamm requests.
                if (usernameChanged) {
                  setUsernameChanged(false);
                  return checkUserName(user, value).then(response => {
                    setUsernameAvailable(!response.data);
                    return !response.data;
                  });
                } else {
                  return usernameAvailable;
                }
              })
      ),

    email: Yup.string()

      .matches(
        // eslint-disable-next-line
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        t('views.user.form.emailNotValid')
      )
      .required(fieldIsRequired),
    name: Yup.string().required(fieldIsRequired),
    password: Yup.string()
      .min(5, t('views.user.form.passwordTooShort'))
      .when('other', (other, schema) =>
        isEdit ? schema : schema.required(fieldIsRequired)
      ),
    confirmPassword: Yup.string().when('password', (password, schema) =>
      password
        ? schema
            .required(fieldIsRequired)
            .test(
              'confirmPassword',
              t('views.user.form.passwordConfirmFailed'),
              value => password === value
            )
        : schema
    ),
    role: Yup.string().required(fieldIsRequired),
    hub: Yup.mixed().when('role', (role, schema) =>
      showHubName(user) && !isEdit && role === ROLES_NAMES.ROLE_HUB_ADMIN
        ? schema.required(fieldIsRequired)
        : schema
    ),
    organization: Yup.mixed().when('other', (other, schema) =>
      !showHubName(user) && !isEdit && user.role !== ROLES_NAMES.ROLE_APP_ADMIN
        ? schema.required(fieldIsRequired)
        : schema
    )
  });

  useEffect(() => {
    if (!!userId && open) {
      setLoading(true);
      getUserById(user, userId).then(response => {
        let user = response.data.data.retrieveUser;
        const projects = user.projects.map(project => ({
          label: project.title,
          value: project.id
        }));
        setUserToEdit({ ...user, projects: projects });
      });
    }
  }, [open]);

  useEffect(() => {
    setLoading(false);
  }, [userToEdit.id]);

  const onClose = submitted => {
    submitted && afterSubmit();
    toggleModal();
    setUserToEdit({});
  };

  const onSubmit = values => {
    // setLoading(true);
    delete values.confirmPassword;
    if (user.role === ROLES_NAMES.ROLE_APP_ADMIN)
      values.organization = user.organization.id;
    if (values.organization) values.hub = user.hub.id;
    else values.organization = null;
    values.name = capitalize(values.name);

    const projects = values.projects.map(project => ({ id: project.value }));

    addOrUpdateUser(user, {
      ...values,
      projects: projects
    })
      .then(() => {
        // setLoading(false);
        onClose(true);
        enqueueSnackbar(t('views.user.form.save.success'), {
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
        enqueueSnackbar(e.response.data.message, {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);
        onClose(true);
      });
  };

  const getRoleOptions = ({ role }) => {
    if (role === ROLES_NAMES.ROLE_ROOT) {
      return [
        { label: t('role.ROLE_HUB_ADMIN'), value: ROLES_NAMES.ROLE_HUB_ADMIN },
        { label: t('role.ROLE_PS_TEAM'), value: ROLES_NAMES.ROLE_PS_TEAM }
      ];
    } else if (role === ROLES_NAMES.ROLE_PS_TEAM) {
      return [
        { label: t('role.ROLE_HUB_ADMIN'), value: ROLES_NAMES.ROLE_HUB_ADMIN }
      ];
    } else if (role === ROLES_NAMES.ROLE_HUB_ADMIN) {
      return [
        { label: t('role.ROLE_APP_ADMIN'), value: ROLES_NAMES.ROLE_APP_ADMIN }
      ];
    } else if (role === ROLES_NAMES.ROLE_APP_ADMIN) {
      const roles = [
        {
          label: t('role.ROLE_SURVEY_USER_ADMIN'),
          value: ROLES_NAMES.ROLE_SURVEY_USER_ADMIN
        },
        {
          label: t('role.ROLE_SURVEY_USER'),
          value: ROLES_NAMES.ROLE_SURVEY_USER
        },
        {
          label: t('role.ROLE_SURVEY_TAKER'),
          value: ROLES_NAMES.ROLE_SURVEY_TAKER
        }
      ];
      if (checkAccessToFamilyUsers(user))
        roles.push({
          label: t('role.ROLE_FAMILY_USER'),
          value: ROLES_NAMES.ROLE_FAMILY_USER
        });

      return roles;
    }
  };

  const showHubName = ({ role }) =>
    role === ROLES_NAMES.ROLE_ROOT || role === ROLES_NAMES.ROLE_PS_TEAM;

  const showProjectsSelector = ({ role }) =>
    role === ROLES_NAMES.ROLE_APP_ADMIN && checkAccessToProjects(user);

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => (isEdit ? onClose(false) : setOpenExitModal(true))}
    >
      {loading ? (
        <div className={classes.modalBody}>
          <div className={classes.loadingContainer}>
            <CircularProgress style={{ margin: 'auto' }} />
          </div>
        </div>
      ) : (
        <div className={classes.modalBody}>
          <ExitModal
            open={openExitModal}
            onDissmiss={() => setOpenExitModal(false)}
            onClose={() => {
              setOpenExitModal(false);
              onClose(false);
            }}
          />
          <Typography
            variant="h5"
            test-id="title-bar"
            align="center"
            style={{ marginBottom: 10 }}
          >
            {!isEdit
              ? t('views.user.form.addTitle')
              : t('views.user.form.editTitle')}
          </Typography>
          <IconButton
            className={classes.closeIcon}
            key="dismiss"
            onClick={() => (isEdit ? onClose(false) : setOpenExitModal(true))}
          >
            <CloseIcon style={{ color: 'green' }} />
          </IconButton>
          <Formik
            initialValues={{
              id: userId || null,
              username: (isEdit && userToEdit.username) || '',
              email: (isEdit && userToEdit.email) || '',
              name: (isEdit && capitalize(userToEdit.name)) || '',
              password: '',
              confirmPassword: '',
              role: (isEdit && !!userToEdit && userToEdit.role) || '',
              organization:
                (isEdit &&
                  !!userToEdit.organization &&
                  userToEdit.organization.id) ||
                '',
              hub:
                (isEdit &&
                  !!userToEdit.application &&
                  userToEdit.application.id) ||
                null,
              active: isEdit ? userToEdit.active : true,
              projects:
                (isEdit && !!userToEdit.projects && userToEdit.projects) || []
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              onSubmit(values);
            }}
          >
            {({
              setFieldValue,
              values,
              disabled,
              touched,
              setTouched,
              isSubmitting
            }) => (
              <Form noValidate autoComplete={'off'}>
                <InputWithFormik
                  label={t('views.user.form.username')}
                  name="username"
                  notAutoFill
                  onChange={e => {
                    let value = e.target.value || '';
                    value = value.toLowerCase().trim();
                    setFieldValue('username', value);
                    setUsernameChanged(true);
                  }}
                  required
                  className={classes.input}
                  disabled={isEdit}
                />
                <InputWithFormik
                  label={t('views.user.form.name')}
                  name="name"
                  notAutoFill
                  required
                  className={classes.nameField}
                />
                <InputWithFormik
                  label={t('views.user.form.email')}
                  name="email"
                  required
                  className={classes.input}
                />
                {!isEdit && (
                  <InputWithFormik
                    label={t('views.user.form.password')}
                    name="password"
                    required
                    type="password"
                    notAutoFill
                    className={classes.input}
                  />
                )}
                {!isEdit && (
                  <InputWithFormik
                    label={t('views.user.form.confirmPassword')}
                    name="confirmPassword"
                    required
                    type="password"
                    className={classes.input}
                  />
                )}
                {!isEdit ? (
                  <AutocompleteWithFormik
                    label={t('views.user.form.role')}
                    name="role"
                    rawOptions={getRoleOptions(user)}
                    labelKey="label"
                    valueKey="value"
                    isClearable={false}
                    required
                  />
                ) : (
                  <InputWithFormik
                    label={t('views.user.form.role')}
                    name="role"
                    value={t(`role.${values.role}`)}
                    required
                    className={classes.input}
                    disabled={true}
                  />
                )}
                {isEdit ? (
                  !showHubName(userToEdit) && (
                    <InputWithFormik
                      label={
                        showHubName(user)
                          ? t('views.hubsFilter.label')
                          : t('views.organizationsFilter.label')
                      }
                      name="hub"
                      value={
                        showHubName(user)
                          ? !!userToEdit && userToEdit.hubName
                          : !!userToEdit && userToEdit.organizationName
                      }
                      required
                      className={classes.input}
                      disabled={true}
                    />
                  )
                ) : (
                  <UserOrgSelector
                    applicationValue={values.hub}
                    organizationValue={values.organization}
                    selectedRole={values.role}
                  />
                )}
                {isEdit && (
                  <div className={classes.activeContainer}>
                    <Typography variant="subtitle1" className={classes.active}>
                      {t('views.user.form.active')}
                    </Typography>
                    <GreenCheckbox
                      name={'active'}
                      value={'active'}
                      onChange={e => {
                        setFieldValue('active', !values.active);
                      }}
                      checked={values.active}
                    />
                  </div>
                )}

                {showProjectsSelector(user) && (
                  <ProjectsSelector
                    withTitle={false}
                    projectData={values.projects}
                    onChangeProject={(selected, allProjects) => {
                      if (selected.some(project => project.value === 'ALL')) {
                        setFieldValue('projects', allProjects);
                      } else {
                        setFieldValue('projects', selected);
                      }
                    }}
                    isMulti={true}
                    isClearable={true}
                    onBlur={() =>
                      setTouched(
                        Object.assign(touched, {
                          indicators: true
                        })
                      )
                    }
                    stacked={true}
                  />
                )}
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
      )}
    </Modal>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(withSnackbar(UserFormModal));
