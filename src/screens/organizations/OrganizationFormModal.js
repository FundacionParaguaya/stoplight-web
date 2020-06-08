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
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';

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
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [subOrganizations, setSubOrganizations] = useState([]);
  const [organization, setOrganization] = useState({});
  const fieldIsRequired = 'validation.fieldIsRequired';
  const validEmailAddress = 'validation.validEmailAddress';

  const organizationTypeOptions = [
    { label: t('views.organization.form.organizationType.ngo'), value: 'NGO' },
    {
      label: t('views.organization.form.organizationType.government'),
      value: 'GOVERNMENT'
    },
    {
      label: t('views.organization.form.organizationType.social'),
      value: 'SOCIAL_ENTERPRISE'
    },

    {
      label: t('views.organization.form.organizationType.academia'),
      value: 'ACADEMIA'
    },
    {
      label: t('views.organization.form.organizationType.company'),
      value: 'COMPANY'
    },
    {
      label: t('views.organization.form.organizationType.microfinance'),
      value: 'MICROFINANCE'
    },
    {
      label: t('views.organization.form.organizationType.other'),
      value: 'OTHER'
    }
  ];

  const areaOfExpertiseOptions = [
    {
      label: t('views.organization.form.areaOfExpertiseOptions.agriculture'),
      value: 'AGRICULTURE'
    },
    {
      label: t('views.organization.form.areaOfExpertiseOptions.commerce'),
      value: 'COMMERCE'
    },
    {
      label: t('views.organization.form.areaOfExpertiseOptions.construction'),
      value: 'CONSTRUCTION'
    },

    {
      label: t('views.organization.form.areaOfExpertiseOptions.education'),
      value: 'EDUCATION'
    },
    {
      label: t('views.organization.form.areaOfExpertiseOptions.finance'),
      value: 'FINANCE'
    },
    {
      label: t('views.organization.form.areaOfExpertiseOptions.health'),
      value: 'HEALTH'
    },
    {
      label: t(
        'views.organization.form.areaOfExpertiseOptions.socialDevelopment'
      ),
      value: 'SOCIAL_DEVELOPMENT'
    },
    {
      label: t('views.organization.form.areaOfExpertiseOptions.technology'),
      value: 'TECHNOLOGY'
    },
    {
      label: t('views.organization.form.areaOfExpertiseOptions.other'),
      value: 'OTHER'
    }
  ];

  const finalUserTypeOptions = [
    {
      label: t('views.organization.form.finalUserTypeOptions.clients'),
      value: 'CLIENTS'
    },
    {
      label: t('views.organization.form.finalUserTypeOptions.companyEmployees'),
      value: 'COMPANY_EMPLOYEES'
    },
    {
      label: t(
        'views.organization.form.finalUserTypeOptions.programBeneficiaries'
      ),
      value: 'PROGRAM_BENEFICIARIES'
    },
    {
      label: t('views.organization.form.finalUserTypeOptions.other'),
      value: 'OTHER'
    }
  ];

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

  useEffect(() => {
    subOrganizations && open === true && setLoading(false);
  }, [subOrganizations]);

  useEffect(() => {
    getOrganizationsByHub(user, null)
      .then(response => {
        const orgs = _.get(response, 'data.data.organizations', []).map(
          org => ({
            label: org.name,
            value: org.id
          })
        );
        setOrganizations(orgs);
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
              onClose();
              setLoading(false);
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
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
        onClose();
        enqueueSnackbar(t('views.organization.form.get.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
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
    setLoading(true);
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
                (!!organization.supportEmail && organization.supportEmail) ||
                '',
              organizationType:
                (!!organization.organizationType &&
                  organization.organizationType) ||
                null,
              areaOfExpertise:
                (!!organization.areaOfExpertise &&
                  organization.areaOfExpertise) ||
                null,
              finalUserType:
                (!!organization.finalUserType && organization.finalUserType) ||
                null
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
              <AutocompleteWithFormik
                label={t('views.organization.form.typeOfOrganization')}
                name="organizationType"
                rawOptions={organizationTypeOptions}
                labelKey="label"
                valueKey="value"
                isClearable={false}
              />

              <AutocompleteWithFormik
                label={t('views.organization.form.areaOfExpertise')}
                name="areaOfExpertise"
                rawOptions={areaOfExpertiseOptions}
                labelKey="label"
                valueKey="value"
                isClearable={false}
              />

              <AutocompleteWithFormik
                label={t('views.organization.form.finalUserType')}
                name="finalUserType"
                rawOptions={finalUserTypeOptions}
                labelKey="label"
                valueKey="value"
                isClearable={false}
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
