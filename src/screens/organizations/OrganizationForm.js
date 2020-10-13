import {
  Button,
  CircularProgress,
  IconButton,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import * as _ from 'lodash';
import { withSnackbar } from 'notistack';
import React, { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import * as Yup from 'yup';
import { addOrUpdateOrg } from '../../api';
import {
  getOrganization,
  getOrganizationAreaTypes,
  getOrganizationEndSurveyTypesTypes,
  getOrganizationFinalUserTypes,
  getOrganizationsByHub,
  getOrganizationTypes,
  getSolutionsAccessTypes
} from '../../api.js';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import BottomSpacer from '../../components/BottomSpacer';
import ExitModal from '../../components/ExitModal';
import InputWithFormik from '../../components/InputWithFormik';
import withLayout from '../../components/withLayout';
import { checkAccessToSolution } from '../../utils/role-utils';
import { selectStyle } from '../../utils/styles-utils';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import { useDropzone } from 'react-dropzone';
import { MB_SIZE, toBase64 } from '../../utils/files-utils';
import Container from '../../components/Container';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  typographyStyle: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: 30
  },
  label: {
    paddingTop: '1rem',
    paddingBottom: '0.5rem'
  },
  dropzoneContainer: {
    position: 'relative',
    marginBottom: 10
  },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0px 10px 0px',
    padding: '70px 0px 10px 0px',
    border: `4px dashed ${theme.palette.grey.quarter}`,
    backgroundColor: theme.palette.grey.light,
    outline: 'none'
  },
  img: {
    position: 'absolute',
    maxWidth: 152,
    top: '10%',
    left: '33%',
    backgroundColor: theme.palette.background.default
  },
  icon: {
    fontSize: '8vh',
    color: theme.palette.grey.quarter
  }
}));

const fieldIsRequired = 'validation.fieldIsRequired';
const validEmailAddress = 'validation.validEmailAddress';

const OrganizationFormModal = ({
  user,
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  const { orgId } = useParams();
  const isCreate = !orgId;
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();

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

  const [loading, setLoading] = useState(true);
  const [openExitModal, setOpenExitModal] = useState(false);
  const [subOrganizations, setSubOrganizations] = useState([]);
  const [organization, setOrganization] = useState({});
  const [file, setFile] = useState('');
  const [error, setError] = useState(false);

  const [options, setOptions] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      organizations: [],
      organizationTypes: [],
      organizationAreasTypes: [],
      organizationFinalUserTypes: [],
      organizationEndSurveyTypes: [],
      solutionsAccessTypes: []
    }
  );

  useEffect(() => {
    getOrganizationTypes(user, language).then(response => {
      let organizationTypes = response.data.data.organizantionTypes.map(
        type => ({
          value: type.code,
          label: type.description
        })
      );
      setOptions({ organizationTypes });
    });

    getOrganizationAreaTypes(user, language).then(response => {
      let organizationAreasTypes = response.data.data.organizationAreasTypes.map(
        type => ({
          value: type.code,
          label: type.description
        })
      );
      setOptions({ organizationAreasTypes });
    });

    getOrganizationFinalUserTypes(user, language).then(response => {
      let organizationFinalUserTypes = response.data.data.organizationFinalUserTypes.map(
        type => ({
          value: type.code,
          label: type.description
        })
      );
      setOptions({ organizationFinalUserTypes });
    });

    getOrganizationEndSurveyTypesTypes(user, language).then(response => {
      let organizationEndSurveyTypes = response.data.data.organizationEndSurveyTypes.map(
        type => ({
          value: type.code,
          label: type.description
        })
      );
      setOptions({ organizationEndSurveyTypes });
    });

    getSolutionsAccessTypes(user, language).then(response => {
      const solutionsAccessTypes = response.data.data.solutionsAccess.map(
        type => ({
          label: type.description,
          value: type.code
        })
      );
      setOptions({ solutionsAccessTypes });
    });
  }, [language]);

  useEffect(() => {
    setLoading(true);
    getOrganizationsByHub(user, null)
      .then(response => {
        const organizations = _.get(
          response,
          'data.data.organizations',
          []
        ).map(org => ({
          label: org.name,
          value: org.id
        }));
        setOptions({ organizations });
        !isCreate
          ? getOrganization(user, orgId)
              .then(response => {
                setOrganization(response.data);
                const subOrgs = response.data.subOrganizations.map(org => ({
                  label: org.name,
                  value: org.id
                }));
                setLoading(false);
                setSubOrganizations(subOrgs);
              })
              .catch(e => {
                console.log(e);
                setLoading(false);
                enqueueSnackbar(t('views.organization.form.get.failed'), {
                  variant: 'error',
                  action: key => (
                    <IconButton
                      key="dismiss"
                      onClick={() => closeSnackbar(key)}
                    >
                      <CloseIcon style={{ color: 'white' }} />
                    </IconButton>
                  )
                });
              })
          : setLoading(false);
      })
      .catch(e => {
        console.log(e);
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
  }, []);

  const onSubmit = values => {
    values.organizationType = !!values.organizationType
      ? values.organizationType
      : null;
    values.areaOfExpertise = !!values.areaOfExpertise
      ? values.areaOfExpertise
      : null;
    values.finalUserType = !!values.finalUserType ? values.finalUserType : null;
    values.endSurveyType = !!values.endSurveyType ? values.endSurveyType : null;
    values.solutionsAccess = !!values.solutionsAccess
      ? values.solutionsAccess
      : null;

    setLoading(true);
    const orgs = subOrganizations.map(m => ({ id: m.value }));
    addOrUpdateOrg(user, {
      ...values,
      subOrganizations: orgs,
      application: user.hub,
      file: file
    })
      .then(() => {
        enqueueSnackbar(t('views.organization.form.save.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        history.push('/organizations');
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.organization.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setLoading(false);
      });
  };

  const onDropAccepted = async acceptedFiles => {
    setError(false);
    const base64File = await toBase64(acceptedFiles[0]);
    setFile(base64File);
  };

  const onDropRejected = () => {
    setError(true);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 10 * MB_SIZE,
    onDropAccepted,
    onDropRejected,
    accept: ['.png', '.jpg', '.heic', '.heif']
  });

  return (
    <React.Fragment>
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <Container variant="slim">
          <ExitModal
            open={openExitModal}
            onDissmiss={() => setOpenExitModal(false)}
            onClose={() => history.push(`/organizations`)}
          />
          <Prompt
            when={!openExitModal && !loading}
            message={t('views.exitModal.confirmText')}
          />
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

          <Formik
            initialValues={{
              id: (!!organization.id && organization.id) || '',
              name: (!!organization.name && organization.name) || '',
              description:
                (!!organization.description && organization.description) || '',
              supportEmail:
                (!!organization.supportEmail && organization.supportEmail) ||
                '',
              organizationType:
                (!!organization.organizationType &&
                  organization.organizationType) ||
                '',
              areaOfExpertise:
                (!!organization.areaOfExpertise &&
                  organization.areaOfExpertise) ||
                '',
              finalUserType:
                (!!organization.finalUserType && organization.finalUserType) ||
                '',
              endSurveyType:
                (!!organization.endSurveyType && organization.endSurveyType) ||
                '',
              solutionsAccess:
                (!!organization.solutionsAccess &&
                  organization.solutionsAccess) ||
                ''
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={values => {
              setLoading(true);
              onSubmit(values);
            }}
          >
            {({ isSubmitting }) => (
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
                  rawOptions={options.organizationTypes}
                  labelKey="label"
                  valueKey="value"
                  isClearable={false}
                />

                <AutocompleteWithFormik
                  label={t('views.organization.form.areaOfExpertise')}
                  name="areaOfExpertise"
                  rawOptions={options.organizationAreasTypes}
                  labelKey="label"
                  valueKey="value"
                  isClearable={false}
                />

                <AutocompleteWithFormik
                  label={t('views.organization.form.finalUserType')}
                  name="finalUserType"
                  rawOptions={options.organizationFinalUserTypes}
                  labelKey="label"
                  valueKey="value"
                  isClearable={false}
                />

                <AutocompleteWithFormik
                  label={t('views.organization.form.endSurveyType')}
                  name="endSurveyType"
                  rawOptions={options.organizationEndSurveyTypes}
                  labelKey="label"
                  valueKey="value"
                  isClearable={false}
                />

                {checkAccessToSolution(user) && (
                  <AutocompleteWithFormik
                    label={t('views.organization.form.solutionAccessType')}
                    name="solutionsAccess"
                    rawOptions={options.solutionsAccessTypes}
                    labelKey="label"
                    valueKey="value"
                    isClearable={false}
                  />
                )}
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
                      options={options.organizations}
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
                <div className={classes.dropzoneContainer}>
                  <div {...getRootProps({ className: classes.dropzone })}>
                    <input {...getInputProps()} />
                    <AddAPhoto className={classes.icon} />
                    <Typography style={{ paddingTop: 55 }} variant="subtitle1">
                      {!isCreate && !!organization.logoUrl
                        ? t('views.hub.form.changeLogo')
                        : t('views.hub.form.logoUpload')}{' '}
                    </Typography>
                  </div>

                  {(!!file || !!organization.logoUrl) && (
                    <img
                      src={file ? file : organization.logoUrl}
                      alt="Choose Life Map"
                      className={classes.img}
                    />
                  )}
                </div>
                {error && (
                  <Typography color="error">
                    {t('views.hub.form.fileUploadError')}
                  </Typography>
                )}

                <div className={classes.buttonContainerForm}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpenExitModal(true);
                    }}
                    disabled={isSubmitting}
                  >
                    {t('general.cancel')}
                  </Button>

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
          <BottomSpacer />
        </Container>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(
  withLayout(withSnackbar(OrganizationFormModal))
);
