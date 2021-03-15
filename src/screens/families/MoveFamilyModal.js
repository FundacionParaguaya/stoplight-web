import React, { useState } from 'react';
import {
  Modal,
  Typography,
  Button,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import OrganizationSelector from '../../components/selectors/OrganizationSelector';
import FacilitatorFilter from '../../components/FacilitatorFilter';
import ProjectsSelector from '../../components/selectors/ProjectsSelector';
import { Formik, Form } from 'formik';
import { ROLES_NAMES } from '../../utils/role-utils';
import CloseIcon from '@material-ui/icons/Close';
import * as Yup from 'yup';
import { migrateFamilies } from '../../api';
import { withSnackbar } from 'notistack';

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
    maxHeight: '55vh',
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
  buttonContainer: {
    marginTop: 25,
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  confirmModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: '100%'
  },
  confirmButtonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 40
  }
}));

const MoveFamilyModal = ({
  open,
  toggleModal,
  user,
  selectedFamilies,
  enqueueSnackbar,
  closeSnackbar,
  afterSubmit
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const fieldIsRequired = 'validation.fieldIsRequired';

  const validationSchema = Yup.object({
    organization: Yup.object().required(fieldIsRequired),
    facilitator: Yup.object().required(fieldIsRequired)
  });

  const onClose = submitted => {
    submitted && afterSubmit();
    setConfirmSubmit(false);
    toggleModal();
  };

  const showProjectsSelector = ({ hub, role }) => {
    return (!!hub && hub.projectsSupport) || role === ROLES_NAMES.ROLE_ROOT;
  };

  const onSubmit = values => {
    setConfirmSubmit(true);
  };

  const handleMoveFamilies = values => {
    const families = selectedFamilies.map(family => {
      return { familyId: family.familyId };
    });
    setLoading(true);

    migrateFamilies(
      user,
      families,
      values.organization ? values.organization.value : null,
      values.facilitator ? values.facilitator.value : null,
      values.project ? values.project.value : null
    )
      .then(res => {
        onClose(true);
        enqueueSnackbar(t('views.familyList.moveFamily.success'), {
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
        enqueueSnackbar(t('views.user.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        //setLoading(false);
        onClose(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => {
        setConfirmSubmit(false);
        onClose(false);
      }}
    >
      <div className={classes.modalBody}>
        <IconButton
          className={classes.closeIcon}
          key="dismiss"
          onClick={() => onClose(false)}
        >
          <CloseIcon style={{ color: 'green' }} />
        </IconButton>
        <Formik
          initialValues={{
            organization: '',
            facilitator: '',
            project: ''
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values, touched, resetForm }) => (
            <Form>
              {confirmSubmit ? (
                <div className={classes.confirmModal}>
                  <Typography
                    variant="h5"
                    align="center"
                    style={{ marginBottom: 10 }}
                  >
                    {t('views.familyList.moveFamily.confirm')}
                  </Typography>
                  {loading ? (
                    <CircularProgress className={classes.loadingContainer} />
                  ) : (
                    <div className={classes.confirmButtonContainer}>
                      <Button
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                        onClick={() => handleMoveFamilies(values)}
                      >
                        {t('general.yes')}
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setConfirmSubmit(false)}
                      >
                        {t('general.no')}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={classes.selectorsContainer}>
                  <Typography
                    variant="h5"
                    align="center"
                    style={{ marginBottom: 10 }}
                  >
                    {t('views.familyList.moveFamily.moveOfOrg')}
                  </Typography>
                  <OrganizationSelector
                    data={values.organization}
                    onChange={value => {
                      resetForm();
                      setFieldValue('organization', value);
                      setFieldValue('facilitator', '');
                      setFieldValue('project', '');
                    }}
                    isClearable={true}
                  />
                  {values.organization && (
                    <>
                      <FacilitatorFilter
                        label={t('views.familyList.moveFamily.facilitator')}
                        data={values.facilitator}
                        organizations={
                          values.organization ? [values.organization] : null
                        }
                        onChange={value => setFieldValue('facilitator', value)}
                        isClearable={true}
                        stacked={true}
                        error={touched.organization && !values.facilitator}
                        required={true}
                      />
                      {showProjectsSelector(user) && (
                        <ProjectsSelector
                          withTitle
                          projectData={values.project}
                          organizationData={values.organization}
                          stacked
                          noDropdownArrow
                          renderIfOptions
                          onChangeProject={value =>
                            setFieldValue('project', value)
                          }
                        />
                      )}
                      <div className={classes.buttonContainer}>
                        <Button
                          className={classes.button}
                          type="submit"
                          color="primary"
                          variant="contained"
                        >
                          {t('general.save')}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
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

export default connect(mapStateToProps)(withSnackbar(MoveFamilyModal));
