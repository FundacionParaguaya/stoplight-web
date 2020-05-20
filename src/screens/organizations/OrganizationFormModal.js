import React, { useState, useEffect } from 'react';
import {
  Modal,
  Typography,
  Button,
  CircularProgress,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import InputWithFormik from '../../components/InputWithFormik';
import * as Yup from 'yup';
import { addOrUpdateOrg } from '../../api';
import Select from 'react-select';
import { getOrganizationsByHub, getOrganization } from '../../api.js';
import * as _ from 'lodash';

const selectStyle = {
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: '#FFFFFF;',
    borderRadius: 2,
    '&:hover': { borderColor: isFocused ? '#309E43' : 'hsl(0, 0%, 70%)' },
    border: isFocused ? '1.5px solid #309E43' : '1.5px solid #DCDEE3',
    boxShadow: isFocused ? '0 0 0 1px #309E43' : 'none'
  }),
  multiValueLabel: styles => ({
    ...styles,
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: 500,
    color: 'rgba(28,33,47,0.51)'
  }),
  multiValue: styles => ({ ...styles, color: 'rgba(28,33,47,0.51)' }),
  option: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: isFocused ? 'hsl(0,0%,90%)' : 'transparent',
    fontSize: 14,
    fontFamily: 'Poppins'
  }),
  noOptionsMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  }),
  loadingMessage: styles => ({
    ...styles,
    fontSize: 16,
    fontFamily: 'Poppins'
  })
};

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  typographyStyle: {
    marginBottom: 20
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginTop: 30
  },
  label: {
    paddingTop: '1rem',
    paddingBottom: '0.5rem'
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
    outline: 'none'
  },

  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    marginBottom: 15
  },

  icon: {
    fontSize: '8vh',
    color: theme.palette.grey.quarter
  }
}));

const OrganizationFormModal = ({
  open,
  toggleModal,
  user,
  org,
  enqueueSnackbar,
  closeSnackbar,
  afterSubmit
}) => {
  const isCreate = !org.id;
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState({});
  const [subOrganizations, setSubOrganizations] = useState([]);
  const [organization, setOrganization] = useState({});
  const fieldIsRequired = 'validation.fieldIsRequired';
  const validEmailAddress = 'validation.validEmailAddress';

  //Validation criterias
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(fieldIsRequired)
      .max(50, t('views.organization.form.nameLengthExceeded')),
    description: Yup.string().max(
      140,
      t('views.organization.form.descriptionLengthExceeded')
    ),
    supportEmail: Yup.string().email(validEmailAddress)
  });

  //Effect to load organization info
  useEffect(() => {
    if (org.id && open) {
      getOrganization(user, org.id)
        .then(response => {
          setOrganization(response.data);
          const subOrgs = response.data.subOrganizations.map(org => ({
            label: org.name,
            value: org.id
          }));
          setSubOrganizations(subOrgs);
        })
        .catch(e => {
          console.log(e);
          enqueueSnackbar(t('views.organization.form.get.failed'), {
            variant: 'error',
            action: key => (
              <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
                <CloseIcon style={{ color: 'white' }} />
              </IconButton>
            )
          });
        });
    } else {
      //Clear form info
      setSubOrganizations([]);
      setOrganization({});
    }
  }, [open]);

  //Effect to load sub-organizations
  useEffect(() => {
    if (open) {
      console.log('--LLamada a load orgs by hub--');
      setLoading(true);
      setOrganizations([]);
      getOrganizationsByHub(user, null)
        .then(response => {
          const orgs = _.get(response, 'data.data.organizations', []).map(
            org => ({
              label: org.name,
              value: org.id
            })
          );
          setOrganizations(orgs);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const onSubmit = values => {
    console.log('calling on submit');
    console.log(user);
    setLoading(true);
    const orgs = subOrganizations.map(m => ({ id: m.value }));
    addOrUpdateOrg(user, {
      ...values,
      subOrganizations: orgs,
      application: user.hub
    })
      .then(() => {
        setLoading(false);
        onClose({ deleteModalOpen: false });
        setSubOrganizations([]);
        setOrganization({});
        afterSubmit();
        enqueueSnackbar(t('views.organization.form.save.success'), {
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
        setSubOrganizations([]);
        setOrganization({});
        enqueueSnackbar(t('views.organization.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);
        onClose();
      });
  };
  const onClose = () => {
    toggleModal();
  };
  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      className={classes.modal}
      open={open}
      onClose={() => onClose()}
    >
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
            {isCreate
              ? t('views.organization.form.addTitle')
              : t('views.organization.form.editTitle')}
          </Typography>
          <IconButton
            className={classes.closeIcon}
            key="dismiss"
            onClick={() => onClose()}
          >
            <CloseIcon style={{ color: 'green' }} />
          </IconButton>
          <Formik
            initialValues={{
              id: (!!organization.id && organization.id) || null,
              name: (!!organization.name && organization.name) || '',
              description:
                (!!organization.description && organization.description) || '',
              supportEmail:
                (!!organization.supportEmail && organization.supportEmail) || ''
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={values => {
              setLoading(true);
              onSubmit(values);
            }}
          >
            <Form noValidate>
              <InputWithFormik
                label={t('views.organization.form.name')}
                name="name"
                required
              />
              <InputWithFormik
                label={t('views.organization.form.description')}
                name="description"
              />
              <InputWithFormik
                label={t('views.organization.form.email')}
                name="supportEmail"
              />
              <div className={classes.container}>
                <Typography variant="subtitle1" className={classes.label}>
                  {t('views.organization.form.subOrg')}
                </Typography>

                <div className={classes.selector}>
                  <Select
                    value={subOrganizations}
                    onChange={value => setSubOrganizations(value)}
                    placeholder=""
                    isLoading={false}
                    loadingMessage={() =>
                      t('views.organizationsFilter.loading')
                    }
                    noOptionsMessage={() =>
                      t('views.organizationsFilter.noOption')
                    }
                    options={organizations}
                    components={{
                      DropdownIndicator: () => <div />,
                      IndicatorSeparator: () => <div />,
                      ClearIndicator: () => <div />
                    }}
                    isMulti
                    hideSelectedOptions
                    loading={false}
                    styles={selectStyle}
                  />
                </div>
              </div>

              <div className={classes.buttonContainerForm}>
                <Button type="submit" color="primary" variant="contained">
                  {t('general.save')}
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

export default connect(mapStateToProps)(withSnackbar(OrganizationFormModal));
