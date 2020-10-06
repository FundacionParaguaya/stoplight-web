import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import { PhoneNumberUtil } from 'google-libphonenumber';
import countries from 'localized-countries';
import * as _ from 'lodash';
import * as moment from 'moment';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { getFamily, getSurveyById, updateFamilyDetails } from '../../../api';
import familyFaceIcon from '../../../assets/family_face_large.png';
import AutocompleteWithFormik from '../../../components/AutocompleteWithFormik';
import BottomSpacer from '../../../components/BottomSpacer';
import Container from '../../../components/Container';
import DatePickerWithFormik from '../../../components/DatePickerWithFormik';
import ExitModal from '../../../components/ExitModal';
import InputWithFormik from '../../../components/InputWithFormik';
import withLayout from '../../../components/withLayout';
import CallingCodes from '../../lifemap/CallingCodes';

const countryList = countries(require('localized-countries/data/en')).array();
const phoneCodes = CallingCodes.map(element => ({
  ...element,
  country: `${element.country} - (+${element.value})`
}));

const fieldIsRequired = 'validation.fieldIsRequired';
const validEmailAddress = 'validation.validEmailAddress';
const validPhoneNumber = 'validation.validPhoneNumber';
const validDate = 'validation.validDate';

const schemaWithDateTransform = Yup.date()
  .typeError(fieldIsRequired)
  .transform((_value, originalValue) => {
    return originalValue ? moment.unix(originalValue).toDate() : new Date('');
  })
  .required(validDate)
  .test({
    name: 'test-date-range',
    test: function(birthDate) {
      if (birthDate > new Date()) {
        return this.createError({
          message: validDate,
          path: 'birthDate'
        });
      }
      if (birthDate < new Date('1910-01-01')) {
        return this.createError({
          message: validDate,
          path: 'birthDate'
        });
      }
      return true;
    }
  });

const phoneUtil = PhoneNumberUtil.getInstance();
const staticFields = {
  firstName: Yup.string().required(fieldIsRequired),
  lastName: Yup.string().required(fieldIsRequired),
  gender: Yup.string().required(fieldIsRequired),
  birthDate: schemaWithDateTransform,
  documentType: Yup.string().required(fieldIsRequired),
  documentNumber: Yup.string().required(fieldIsRequired),
  birthCountry: Yup.string().required(fieldIsRequired),
  email: Yup.string().email(validEmailAddress),
  phoneCode: Yup.string(),
  phoneNumber: Yup.string()
    .test('phone-test', validPhoneNumber, function(value) {
      let validation = true;
      if (value && value.length > 0) {
        try {
          const { phoneCode } = this.parent;
          const contryCode = phoneCodes.find(x => x.value === phoneCode).code;
          const international = '+' + phoneCode + ' ' + value;
          const phone = phoneUtil.parse(international, contryCode);
          validation = phoneUtil.isValidNumber(phone);
        } catch (e) {
          validation = false;
        }
      }
      return validation;
    })
    .nullable()
};

const buildValidationSchema = (surveyConfig, validationObject) => {
  const forPrimaryParticipant = { ...validationObject };

  const keys = Object.keys(surveyConfig);
  const values = Object.values(surveyConfig)
    .map((field, index) => {
      if (Array.isArray(field)) {
        return {
          codeName: keys[index],
          ...field.filter(e => e.otherOption)[0]
        };
      }

      return null;
    })
    .filter(e => e !== null);

  values.forEach(field => {
    forPrimaryParticipant[
      `custom${_.upperFirst(field.codeName)}`
    ] = Yup.string().when(field.codeName, {
      is: field.value,
      then: Yup.string().required(fieldIsRequired),
      otherwise: Yup.string()
    });
  });

  return Yup.object().shape(forPrimaryParticipant);
};

const useStyles = makeStyles(theme => ({
  topImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 40
  }
}));

const EditPrimaryParticipantForm = ({
  user,
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { familyId } = useParams();

  const [loading, setLoading] = useState();
  const [primaryParticipant, setPrimaryParticipant] = useState({});
  const [surveyConfig, setSurveyConfig] = useState({
    gender: [],
    documentType: []
  });
  const [otherGenderValue, setOtherGenderValue] = useState();
  const [otherDocumentValue, setOtherDocumentValue] = useState();
  const [openExitModal, setOpenExitModal] = useState(false);

  const handleSubmit = values => {
    setLoading(true);
    updateFamilyDetails(user, familyId, [values])
      .then(() => {
        enqueueSnackbar(t('views.familyProfile.form.save.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        history.push(`/family/${familyId}`);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.familyProfile.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  useEffect(() => {
    setLoading(true);
    getFamily(familyId, user)
      .then(response => {
        let family = response.data.data.familyById;
        let primaryParticipant = family.familyMemberDTOList.find(
          element => element.firstParticipant === true
        );

        setPrimaryParticipant(primaryParticipant);
        getSurveyById(user, family.snapshotIndicators.surveyId).then(
          response => {
            let surveyConfig = response.data.data.surveyById.surveyConfig;
            setSurveyConfig(surveyConfig);

            let otherGender = surveyConfig.gender.find(g => g.otherOption);
            setOtherGenderValue(!!otherGender && otherGender.value);

            let documentType = surveyConfig.documentType.find(
              g => g.otherOption
            );
            setOtherDocumentValue(!!documentType && documentType.value);

            setLoading(false);
          }
        );
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, [familyId]);

  return (
    <React.Fragment>
      {loading ? (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <React.Fragment>
          <ExitModal
            open={openExitModal}
            onDissmiss={() => setOpenExitModal(false)}
            onClose={() => history.push(`/family/${familyId}`)}
          />
          <Prompt
            when={!openExitModal && !loading}
            message={t('views.exitModal.confirmText')}
          />
          <div className={classes.topImageContainer}>
            <img alt="" height={60} width={60} src={familyFaceIcon} />
          </div>
          <Container variant="slim">
            <Formik
              initialValues={{
                memberIdentifier:
                  (!!primaryParticipant.memberIdentifier &&
                    primaryParticipant.memberIdentifier) ||
                  '',
                firstName:
                  (!!primaryParticipant.firstName &&
                    primaryParticipant.firstName) ||
                  '',
                lastName:
                  (!!primaryParticipant.lastName &&
                    primaryParticipant.lastName) ||
                  '',
                gender:
                  (!!primaryParticipant.gender && primaryParticipant.gender) ||
                  '',
                customGender:
                  (!!primaryParticipant.customGender &&
                    primaryParticipant.customGender) ||
                  '',
                customDocumentType:
                  (!!primaryParticipant.customDocumentType &&
                    primaryParticipant.customDocumentType) ||
                  '',
                birthDate:
                  (!!primaryParticipant.birthDate &&
                    primaryParticipant.birthDate) ||
                  '',
                documentType:
                  (!!primaryParticipant.documentType &&
                    primaryParticipant.documentType) ||
                  '',
                documentNumber:
                  (!!primaryParticipant.documentNumber &&
                    primaryParticipant.documentNumber) ||
                  '',
                birthCountry:
                  (!!primaryParticipant.birthCountry &&
                    primaryParticipant.birthCountry) ||
                  '',
                email:
                  (!!primaryParticipant.email && primaryParticipant.email) ||
                  '',
                phoneNumber:
                  (!!primaryParticipant.phoneNumber &&
                    primaryParticipant.phoneNumber) ||
                  '',
                phoneCode:
                  (!!primaryParticipant.phoneCode &&
                    primaryParticipant.phoneCode) ||
                  '',
                firstParticipant: true
              }}
              validationSchema={buildValidationSchema(
                surveyConfig,
                staticFields
              )}
              onSubmit={values => handleSubmit(values)}
            >
              {({ isSubmitting, values, setFieldValue, validateForm }) => {
                return (
                  <Form noValidate>
                    <InputWithFormik
                      label={t('views.family.firstName')}
                      name="firstName"
                      required
                    />
                    <InputWithFormik
                      label={t('views.family.lastName')}
                      name="lastName"
                      required
                    />
                    <AutocompleteWithFormik
                      label={t('views.family.selectGender')}
                      name="gender"
                      rawOptions={surveyConfig.gender}
                      labelKey="text"
                      valueKey="value"
                      required
                      isClearable={false}
                    />

                    {values.gender === otherGenderValue && (
                      <InputWithFormik
                        label={`${t('views.family.specify')} ${t(
                          'views.family.gender'
                        ).toLowerCase()}`}
                        name="customGender"
                        required
                      />
                    )}

                    <DatePickerWithFormik
                      label={t('views.family.dateOfBirth')}
                      name="birthDate"
                      test-id="birthDate"
                      maxDate={new Date()}
                      disableFuture
                      required
                      minDate={moment('1910-01-01')}
                      onChange={e => {
                        !!e &&
                          e._isValid &&
                          setFieldValue('birthDate', e.unix());
                      }}
                    />
                    <AutocompleteWithFormik
                      label={t('views.family.documentType')}
                      name="documentType"
                      test-id="documentType"
                      rawOptions={surveyConfig.documentType}
                      labelKey="text"
                      valueKey="value"
                      required
                      isClearable={false}
                    />

                    {values.customDocumentType === otherDocumentValue && (
                      <InputWithFormik
                        label={`${t('views.family.specify')} ${t(
                          'views.family.documentType'
                        ).toLowerCase()}`}
                        name="customDocumentType"
                        required
                      />
                    )}
                    <InputWithFormik
                      label={t('views.family.documentNumber')}
                      name="documentNumber"
                      test-id="documentNumber"
                      required
                    />
                    <AutocompleteWithFormik
                      label={t('views.family.countryOfBirth')}
                      name="birthCountry"
                      test-id="birthCountry"
                      rawOptions={countryList}
                      labelKey="label"
                      valueKey="code"
                      required
                      isClearable={false}
                    />
                    <InputWithFormik
                      label={t('views.family.email')}
                      name="email"
                    />

                    <AutocompleteWithFormik
                      label={t('views.family.phoneCode')}
                      name="phoneCode"
                      rawOptions={phoneCodes}
                      labelKey="country"
                      valueKey="value"
                      isClearable={false}
                    />
                    <InputWithFormik
                      label={t('views.family.phone')}
                      name="phoneNumber"
                    />
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
                        test-id="continue"
                        disabled={isSubmitting}
                        onClick={() => {
                          validateForm().then(validationErrors => {
                            const errorsLength = Object.keys(validationErrors)
                              .length;
                            if (errorsLength > 0) {
                              enqueueSnackbar(
                                errorsLength === 1
                                  ? t('views.family.formWithError')
                                  : t('views.family.formWithErrors').replace(
                                      '%number',
                                      errorsLength
                                    ),
                                {
                                  variant: 'error',
                                  action: key => (
                                    <IconButton
                                      key="dismiss"
                                      onClick={() => closeSnackbar(key)}
                                    >
                                      <CloseIcon style={{ color: 'white' }} />
                                    </IconButton>
                                  )
                                }
                              );
                            }
                          });
                        }}
                      >
                        {t('general.save')}
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <BottomSpacer />
          </Container>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(mapStateToProps)(
  withSnackbar(withLayout(EditPrimaryParticipantForm))
);
