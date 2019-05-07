import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { DatePicker } from 'material-ui-pickers';
import { Formik, Form } from 'formik';
import uuid from 'uuid/v1';
import * as Yup from 'yup';
import * as moment from 'moment';
import countries from 'localized-countries';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import { getErrorLabelForPath, pathHasError } from '../../utils/form-utils';
import Autocomplete from '../../components/Autocomplete';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import familyFaceIcon from '../../assets/family_face_large.png';
import { getDateFormatByLocale } from '../../utils/date-utils';

const countryList = countries(require('localized-countries/data/en')).array();

const fieldIsRequired = 'validation.fieldIsRequired';
const validEmailAddress = 'validation.validEmailAddress';
const schemaWithDateTransform = Yup.date()
  .typeError(fieldIsRequired)
  .transform((_value, originalValue) => {
    return originalValue ? moment.unix(originalValue).toDate() : new Date('');
  })
  .required(fieldIsRequired);
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(fieldIsRequired),
  lastName: Yup.string().required(fieldIsRequired),
  gender: Yup.string().required(fieldIsRequired),
  birthDate: schemaWithDateTransform,
  documentType: Yup.string().required(fieldIsRequired),
  documentNumber: Yup.string().required(fieldIsRequired),
  birthCountry: Yup.string().required(fieldIsRequired),
  countFamilyMembers: Yup.string().required(fieldIsRequired),
  email: Yup.string().email(validEmailAddress)
});

export class PrimaryParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      householdSizeArray: PrimaryParticipant.constructHouseholdArray(props)
    };
  }

  static constructHouseholdArray(props) {
    const { t } = props;
    const MAX_HOUSEHOLD_SIZE = 26;
    const householdSizeArray = [];

    Array(MAX_HOUSEHOLD_SIZE)
      .fill('')
      .forEach((_val, index) => {
        const i = index + 1;
        const value = i === MAX_HOUSEHOLD_SIZE ? -1 : i;
        let text = `${i}`;
        if (i === 1) {
          text = t('views.family.onlyPerson');
        } else if (i === MAX_HOUSEHOLD_SIZE) {
          text = t('views.family.preferNotToSay');
        }
        householdSizeArray.push({ value, text });
      });

    return householdSizeArray;
  }

  createNewDraft() {
    const { currentSurvey } = this.props;

    // create draft skeleton
    this.props.updateDraft({
      draftId: uuid(), // generate unique id based on timestamp
      surveyId: currentSurvey.id,
      surveyVersionId: currentSurvey.surveyVersionId,
      created: Date.now(),
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      priorities: [],
      achievements: [],
      familyData: {
        familyMembersList: [
          {
            firstParticipant: true,
            socioEconomicAnswers: []
          }
        ]
      }
    });
  }

  handleContinue = () => {
    const { currentDraft } = this.props;

    if (currentDraft.familyData.countFamilyMembers === 1) {
      this.props.history.push('/lifemap/location');
    } else {
      this.props.history.push('/lifemap/family-members');
    }
  };

  updateDraft = (field, value) => {
    const { currentDraft } = this.props;

    // update only the first item of familyMembersList
    //  which is the primary participant
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: [
          {
            ...currentDraft.familyData.familyMembersList[0],
            ...{
              [field]: value
            }
          },
          ...currentDraft.familyData.familyMembersList.slice(1)
        ]
      }
    });
  };

  updateFamilyMembersCount = async (field, value) => {
    const { currentDraft } = this.props;

    if (value === 1) {
      const name = currentDraft.familyData.familyMembersList;
      name.splice(1);
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          ...{ countFamilyMembers: value },
          familyMembersList: name
        }
      });
    } else if (currentDraft.familyData.familyMembersList.length < value) {
      const names2 = currentDraft.familyData.familyMembersList;
      for (
        let i = currentDraft.familyData.familyMembersList.length;
        i <= value - 1;
        i++
      ) {
        names2.push({
          firstName: '',
          gender: '',
          birthDate: '',
          firstParticipant: false,
          socioEconomicAnswers: []
        });
      }
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          ...{ countFamilyMembers: value },
          familyMembersList: names2
        }
      });
    } else if (currentDraft.familyData.familyMembersList.length > value) {
      const names3 = currentDraft.familyData.familyMembersList;
      const deleteFrom =
        currentDraft.familyData.familyMembersList.length - value;
      names3.splice(-deleteFrom, deleteFrom);

      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          ...{ countFamilyMembers: value },
          familyMembersList: names3
        }
      });
    }
  };

  componentDidMount = async () => {
    // if there is no current draft in the store create a new one

    if (!this.props.currentDraft) {
      await this.createNewDraft();
    }
    if (this.props.currentDraft) {
      if (
        !this.props.currentDraft.familyData.familyMembersList[0].birthCountry
      ) {
        const { currentDraft } = this.props;
        // update only the first item of familyMembersList
        //  which is the primary participant
        this.props.updateDraft({
          ...currentDraft,
          familyData: {
            ...currentDraft.familyData,
            familyMembersList: [
              ...currentDraft.familyData.familyMembersList.slice(0, 0),
              {
                ...currentDraft.familyData.familyMembersList[0],
                ...{
                  birthCountry: this.props.currentSurvey.surveyConfig
                    .surveyLocation.country
                }
              },
              ...currentDraft.familyData.familyMembersList.slice(1)
            ]
          }
        });
      }
    }
  };

  render() {
    const {
      t,
      currentSurvey,
      classes,
      currentDraft,
      i18n: { language }
    } = this.props;
    const { surveyConfig } = currentSurvey;
    const dateFormat = getDateFormatByLocale(language);

    const participant = currentDraft
      ? currentDraft.familyData.familyMembersList[0]
      : {};
    const defaultEditingObject = {
      firstName: '',
      lastName: '',
      gender: '',
      birthDate: '',
      documentType: '',
      documentNumber: '',
      birthCountry: '',
      countFamilyMembers: '',
      email: '',
      phone: ''
    };

    return (
      <div>
        <TitleBar title={t('views.primaryParticipant')} />
        <div className={classes.topImageContainer}>
          <img height={60} width={60} src={familyFaceIcon} />
        </div>
        <Container variant="slim">
          <Formik
            enableReinitialize
            initialValues={{ ...defaultEditingObject, ...participant }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              this.props.updateDraft({
                ...currentDraft,
                familyData: {
                  ...currentDraft.familyData,
                  familyMembersList: [
                    {
                      ...values
                    },
                    ...currentDraft.familyData.familyMembersList.slice(1)
                  ]
                }
              });
              this.handleContinue();
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
              validateForm
            }) => (
              <Form noValidate>
                <TextField
                  className={
                    values.firstName
                      ? `${this.props.classes.input} ${
                          this.props.classes.inputFilled
                        }`
                      : `${this.props.classes.input}`
                  }
                  variant="filled"
                  label={t('views.family.firstName')}
                  name="firstName"
                  value={values.firstName || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={pathHasError('firstName', touched, errors)}
                  helperText={getErrorLabelForPath(
                    'firstName',
                    touched,
                    errors,
                    t
                  )}
                  fullWidth
                  required
                />
                <TextField
                  className={
                    values.lastName
                      ? `${this.props.classes.input} ${
                          this.props.classes.inputFilled
                        }`
                      : `${this.props.classes.input}`
                  }
                  variant="filled"
                  label={t('views.family.lastName')}
                  name="lastName"
                  value={values.lastName || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={pathHasError('lastName', touched, errors)}
                  helperText={getErrorLabelForPath(
                    'lastName',
                    touched,
                    errors,
                    t
                  )}
                  fullWidth
                  required
                />
                <Autocomplete
                  name="gender"
                  value={{
                    value: values.gender,
                    label: values.gender
                      ? surveyConfig.gender.find(e => e.value === values.gender)
                          .text
                      : ''
                  }}
                  options={surveyConfig.gender.map(e => ({
                    value: e.value,
                    label: e.text
                  }))}
                  onChange={value => {
                    setFieldValue('gender', value ? value.value : '');
                  }}
                  onBlur={() => setFieldTouched('gender')}
                  textFieldProps={{
                    label: t('views.family.selectGender'),
                    required: true,
                    error: pathHasError('gender', touched, errors),
                    helperText: getErrorLabelForPath(
                      'gender',
                      touched,
                      errors,
                      t
                    )
                  }}
                />
                <DatePicker
                  format={dateFormat}
                  label={t('views.family.dateOfBirth')}
                  name="birthDate"
                  value={
                    values.birthDate ? moment.unix(values.birthDate) : null
                  }
                  onChange={e => setFieldValue('birthDate', e.unix())}
                  onClose={() => setFieldTouched('birthDate')}
                  error={pathHasError('birthDate', touched, errors)}
                  helperText={getErrorLabelForPath(
                    'birthDate',
                    touched,
                    errors,
                    t
                  )}
                  TextFieldComponent={textFieldProps => (
                    <TextField
                      className={
                        values.birthDate
                          ? `${this.props.classes.input} ${
                              this.props.classes.inputFilled
                            }`
                          : `${this.props.classes.input}`
                      }
                      variant="filled"
                      {...textFieldProps}
                    />
                  )}
                  fullWidth
                  required
                  disableFuture
                />
                <Autocomplete
                  name="documentType"
                  value={{
                    value: values.documentType,
                    label: values.documentType
                      ? surveyConfig.documentType.find(
                          e => e.value === values.documentType
                        ).text
                      : ''
                  }}
                  options={surveyConfig.documentType.map(e => ({
                    value: e.value,
                    label: e.text
                  }))}
                  onChange={value => {
                    setFieldValue('documentType', value ? value.value : '');
                  }}
                  onBlur={() => setFieldTouched('documentType')}
                  textFieldProps={{
                    label: t('views.family.documentType'),
                    required: true,
                    error: pathHasError('documentType', touched, errors),
                    helperText: getErrorLabelForPath(
                      'documentType',
                      touched,
                      errors,
                      t
                    )
                  }}
                />
                <TextField
                  className={
                    values.documentNumber
                      ? `${this.props.classes.input} ${
                          this.props.classes.inputFilled
                        }`
                      : `${this.props.classes.input}`
                  }
                  variant="filled"
                  label={t('views.family.documentNumber')}
                  value={values.documentNumber || ''}
                  name="documentNumber"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={pathHasError('documentNumber', touched, errors)}
                  helperText={getErrorLabelForPath(
                    'documentNumber',
                    touched,
                    errors,
                    t
                  )}
                  fullWidth
                  required
                />
                <Autocomplete
                  name="birthCountry"
                  value={{
                    value: values.birthCountry,
                    label: values.birthCountry
                      ? countryList.find(e => e.code === values.birthCountry)
                          .label
                      : ''
                  }}
                  options={countryList.map(e => ({
                    value: e.code,
                    label: e.label
                  }))}
                  onChange={value => {
                    setFieldValue('birthCountry', value ? value.value : '');
                  }}
                  onBlur={() => setFieldTouched('birthCountry')}
                  textFieldProps={{
                    label: t('views.family.countryOfBirth'),
                    required: true,
                    error: pathHasError('birthCountry', touched, errors),
                    helperText: getErrorLabelForPath(
                      'birthCountry',
                      touched,
                      errors,
                      t
                    )
                  }}
                />
                <Autocomplete
                  name="countFamilyMembers"
                  value={{
                    value: values.countFamilyMembers,
                    label: values.countFamilyMembers
                      ? this.state.householdSizeArray.find(
                          e => e.value === values.countFamilyMembers
                        ).text
                      : ''
                  }}
                  options={this.state.householdSizeArray.map(e => ({
                    value: e.value,
                    label: e.text
                  }))}
                  onChange={value => {
                    setFieldValue(
                      'countFamilyMembers',
                      value ? value.value : ''
                    );
                    this.updateFamilyMembersCount(
                      null,
                      value ? value.value : 1
                    );
                  }}
                  isClearable={false}
                  onBlur={() => setFieldTouched('countFamilyMembers')}
                  textFieldProps={{
                    label: t('views.family.peopleLivingInThisHousehold'),
                    required: true,
                    error: pathHasError('countFamilyMembers', touched, errors),
                    helperText: getErrorLabelForPath(
                      'countFamilyMembers',
                      touched,
                      errors,
                      t
                    )
                  }}
                />
                <TextField
                  className={
                    values.email
                      ? `${this.props.classes.input} ${
                          this.props.classes.inputFilled
                        }`
                      : `${this.props.classes.input}`
                  }
                  variant="filled"
                  label={t('views.family.email')}
                  value={values.email || ''}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={pathHasError('email', touched, errors)}
                  helperText={getErrorLabelForPath('email', touched, errors, t)}
                  fullWidth
                />
                <TextField
                  className={
                    values.phone
                      ? `${this.props.classes.input} ${
                          this.props.classes.inputFilled
                        }`
                      : `${this.props.classes.input}`
                  }
                  variant="filled"
                  label={t('views.family.phone')}
                  value={values.phone || ''}
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                />

                <div className={classes.buttonContainerForm}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={() => {
                      validateForm().then(validationErrors => {
                        if (Object.keys(validationErrors).length > 0) {
                          console.log(validationErrors);
                          // TODO show something, there are some validation errors
                        }
                      });
                    }}
                  >
                    {t('general.continue')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <BottomSpacer />
        </Container>
      </div>
    );
  }
}

const styles = theme => ({
  topImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  },
  input: {
    marginTop: 10,
    marginBottom: 10
  },
  inputFilled: {
    '& $div': {
      backgroundColor: '#fff!important'
    }
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateDraft };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withStyles(styles)(PrimaryParticipant)));
