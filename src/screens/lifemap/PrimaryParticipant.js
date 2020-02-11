import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import { Formik, Form } from 'formik';
import uuid from 'uuid/v1';
import * as Yup from 'yup';
import * as moment from 'moment';
import * as _ from 'lodash';
import CallingCodes from './CallingCodes';
import { PhoneNumberUtil } from 'google-libphonenumber';
import countries from 'localized-countries';
import InputWithFormik from '../../components/InputWithFormik';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import DatePickerWithFormik from '../../components/DatePickerWithFormik';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import { withScroller } from '../../components/Scroller';
import familyFaceIcon from '../../assets/family_face_large.png';
import InputWithDep from '../../components/InputWithDep';
import {
  getDraftWithUpdatedMember,
  getDraftWithUpdatedQuestionsCascading
} from '../../utils/conditional-logic';

const countryList = countries(require('localized-countries/data/en')).array();
const phoneCodes = CallingCodes.map(element => ({
  ...element,
  country: `${element.country} - (+${element.value})`
}));

const fieldIsRequired = 'validation.fieldIsRequired';
const validEmailAddress = 'validation.validEmailAddress';
const validPhoneNumber = 'validation.validPhoneNumber';

const schemaWithDateTransform = Yup.date()
  .typeError(fieldIsRequired)
  .transform((_value, originalValue) => {
    return originalValue ? moment.unix(originalValue).toDate() : new Date('');
  })
  .required(fieldIsRequired);

const phoneUtil = PhoneNumberUtil.getInstance();
const staticFields = {
  firstName: Yup.string().required(fieldIsRequired),
  lastName: Yup.string().required(fieldIsRequired),
  gender: Yup.string().required(fieldIsRequired),
  birthDate: schemaWithDateTransform,
  documentType: Yup.string().required(fieldIsRequired),
  documentNumber: Yup.string().required(fieldIsRequired),
  birthCountry: Yup.string().required(fieldIsRequired),
  countFamilyMembers: Yup.string()
    .required(fieldIsRequired)
    .nullable(),
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
          console.log(e);
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

export class PrimaryParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      householdSizeArray: PrimaryParticipant.constructHouseholdArray(props),
      validationSpec: {}
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
      sign: '',
      pictures: [],
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
      },
      lifemapNavHistory: [
        {
          url: this.props.match.url
        }
      ]
    });
  }

  handleContinue = () => {
    const { currentDraft } = this.props;
    const { countFamilyMembers } = currentDraft.familyData;
    if (countFamilyMembers === 1 || countFamilyMembers === -1) {
      this.props.history.push('/lifemap/location');
    } else {
      this.props.history.push('/lifemap/family-members');
    }
  };

  updateDraft = (field, value) => {
    const { currentDraft, currentSurvey } = this.props;
    const {
      conditionalQuestions = [],
      elementsWithConditionsOnThem: { memberKeysWithConditionsOnThem }
    } = currentSurvey;

    let newDraft = getDraftWithUpdatedMember(currentDraft, field, value, 0);
    if (memberKeysWithConditionsOnThem.includes(field)) {
      console.log(
        `Will evaluate cascading after updating family key ${field} on member 0`
      );
      newDraft = getDraftWithUpdatedQuestionsCascading(
        newDraft,
        conditionalQuestions
      );
    }

    this.props.updateDraft(newDraft);
  };

  updateFamilyMembersCount = (field, value) => {
    const { currentDraft } = this.props;

    // Covering the case where user does not want to specify
    if (value === 1 || value === -1) {
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
        i += 1
      ) {
        names2.push({
          firstName: '',
          gender: '',
          birthDate: null,
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
      if (!this.props.currentDraft.familyData.familyMembersList[0].phoneCode) {
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
                  phoneCode: phoneCodes.find(
                    e =>
                      e.code ==
                      this.props.currentSurvey.surveyConfig.surveyLocation
                        .country
                  ).value
                }
              },
              ...currentDraft.familyData.familyMembersList.slice(1)
            ]
          }
        });
      }
    }
    if (this.props.currentSurvey) {
      this.setState({
        validationSpec: buildValidationSchema(
          this.props.currentSurvey.surveyConfig,
          staticFields
        )
      });
    }
  };

  syncDraft = (value, key, setFieldValue) => {
    setFieldValue(key, value);
    this.updateDraft(key, value);
  };

  render() {
    const { validationSpec } = this.state;
    const {
      t,
      currentSurvey,
      classes,
      currentDraft,
      scrollToTop,
      enqueueSnackbar,
      closeSnackbar
    } = this.props;
    const { surveyConfig } = currentSurvey;
    // We need the current draft to be created before processing
    if (!this.props.currentDraft) {
      return <TitleBar title={t('views.primaryParticipant')} />;
    }

    const participant = currentDraft
      ? currentDraft.familyData.familyMembersList[0]
      : {};
    const defaultEditingObject = {
      firstName: '',
      lastName: '',
      gender: '',
      customGender: '',
      customDocumentType: '',
      birthDate: '',
      documentType: '',
      documentNumber: '',
      birthCountry: _.get(
        currentSurvey,
        'surveyConfig.surveyLocation.country',
        ''
      ),
      countFamilyMembers: _.get(
        currentDraft,
        'familyData.countFamilyMembers',
        ''
      ),
      email: '',
      phoneNumber: '',
      phoneCode: phoneCodes.find(
        e =>
          e.code ==
          _.get(currentSurvey, 'surveyConfig.surveyLocation.country', '')
      ).value
    };

    return (
      <div>
        <TitleBar title={t('views.primaryParticipant')} progressBar />
        <div className={classes.topImageContainer}>
          <img alt="" height={60} width={60} src={familyFaceIcon} />
        </div>
        <Container variant="slim">
          <Formik
            initialValues={{
              ...defaultEditingObject,
              ...Object.keys(participant).reduce(
                (acc, current) => ({
                  ...acc,
                  [current]:
                    participant[current] || defaultEditingObject[current]
                }),
                {}
              )
            }}
            validationSchema={validationSpec}
            onSubmit={(values, { setSubmitting }) => {
              this.handleContinue();
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, validateForm }) => {
              return (
                <Form noValidate>
                  <InputWithFormik
                    label={t('views.family.firstName')}
                    name="firstName"
                    test-id="firstName"
                    required
                    onChange={e =>
                      this.syncDraft(e.target.value, `firstName`, setFieldValue)
                    }
                  />
                  <InputWithFormik
                    label={t('views.family.lastName')}
                    name="lastName"
                    test-id="lastName"
                    required
                    onChange={e =>
                      this.syncDraft(e.target.value, `lastName`, setFieldValue)
                    }
                  />
                  <AutocompleteWithFormik
                    label={t('views.family.selectGender')}
                    name="gender"
                    test-id="gender"
                    rawOptions={surveyConfig.gender}
                    labelKey="text"
                    valueKey="value"
                    required
                    isClearable={false}
                    onChange={e =>
                      this.syncDraft(e ? e.value : '', 'gender', setFieldValue)
                    }
                  />
                  <InputWithDep
                    dep="gender"
                    from={currentDraft}
                    fieldOptions={surveyConfig.gender}
                    target="customGender"
                    cleanUp={() =>
                      this.syncDraft('', 'customGender', setFieldValue)
                    }
                  >
                    {(otherOption, value) =>
                      otherOption === value && (
                        <InputWithFormik
                          label={`${t('views.family.specify')} ${t(
                            'views.family.gender'
                          ).toLowerCase()}`}
                          name="customGender"
                          required
                          onChange={e =>
                            this.syncDraft(
                              e.target.value,
                              'customGender',
                              setFieldValue
                            )
                          }
                        />
                      )
                    }
                  </InputWithDep>
                  <DatePickerWithFormik
                    label={t('views.family.dateOfBirth')}
                    name="birthDate"
                    test-id="birthDate"
                    maxDate={new Date()}
                    disableFuture
                    required
                    minDate={moment('1910-01-01')}
                    onChange={e =>
                      this.syncDraft(e.unix(), 'birthDate', setFieldValue)
                    }
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
                    onChange={e =>
                      this.syncDraft(
                        e ? e.value : '',
                        'documentType',
                        setFieldValue
                      )
                    }
                  />
                  <InputWithDep
                    dep="documentType"
                    from={currentDraft}
                    fieldOptions={surveyConfig.documentType}
                    target="customDocumentType"
                    cleanUp={() =>
                      this.syncDraft('', 'customDocumentType', setFieldValue)
                    }
                  >
                    {(otherOption, value) =>
                      otherOption === value && (
                        <InputWithFormik
                          label={`${t('views.family.specify')} ${t(
                            'views.family.documentType'
                          ).toLowerCase()}`}
                          name="customDocumentType"
                          required
                          onChange={e =>
                            this.syncDraft(
                              e.target.value,
                              'customDocumentType',
                              setFieldValue
                            )
                          }
                        />
                      )
                    }
                  </InputWithDep>
                  <InputWithFormik
                    label={t('views.family.documentNumber')}
                    name="documentNumber"
                    test-id="documentNumber"
                    required
                    onChange={e =>
                      this.syncDraft(
                        e.target.value,
                        'documentNumber',
                        setFieldValue
                      )
                    }
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
                    onChange={e =>
                      this.syncDraft(
                        e ? e.value : '',
                        'birthCountry',
                        setFieldValue
                      )
                    }
                  />
                  <AutocompleteWithFormik
                    label={t('views.family.peopleLivingInThisHousehold')}
                    name="countFamilyMembers"
                    test-id="countFamilyMembers"
                    rawOptions={this.state.householdSizeArray}
                    labelKey="text"
                    valueKey="value"
                    required
                    isClearable={false}
                    onChange={e => {
                      this.syncDraft(
                        e ? e.value : '',
                        'countFamilyMembers',
                        setFieldValue
                      );
                      this.updateFamilyMembersCount(null, e ? e.value : 1);
                    }}
                  />
                  <InputWithFormik
                    label={t('views.family.email')}
                    name="email"
                    onChange={e =>
                      this.syncDraft(e.target.value, 'email', setFieldValue)
                    }
                  />

                  <AutocompleteWithFormik
                    label={t('views.family.phoneCode')}
                    name="phoneCode"
                    rawOptions={phoneCodes}
                    labelKey="country"
                    valueKey="value"
                    isClearable={false}
                    onChange={e =>
                      this.syncDraft(
                        e ? e.value : '',
                        'phoneCode',
                        setFieldValue
                      )
                    }
                  />
                  <InputWithFormik
                    label={t('views.family.phone')}
                    name="phoneNumber"
                    onChange={e =>
                      this.syncDraft(
                        e.target.value,
                        'phoneNumber',
                        setFieldValue
                      )
                    }
                  />
                  <div className={classes.buttonContainerForm}>
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
                              t('views.family.formWithErrors').replace(
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
                            scrollToTop();
                          }
                        });
                      }}
                    >
                      {t('general.continue')}
                    </Button>
                  </div>
                </Form>
              );
            }}
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
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
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
)(
  withTranslation()(
    withStyles(styles)(withScroller(withSnackbar(PrimaryParticipant)))
  )
);
