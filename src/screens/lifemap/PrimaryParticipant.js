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

  updateDraftWithCurrentValues = values => {
    const { currentDraft } = this.props;
    // The family members count does not belong in the primary participant
    // object. We just put it there for convenience in the editing object.
    // It is removed before storing the primary participant into the draft
    const primaryParticipant = { ...values };
    delete primaryParticipant.countFamilyMembers;
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: [
          {
            ...primaryParticipant
          },
          ...currentDraft.familyData.familyMembersList.slice(1)
        ]
      }
    });
  };

  getFieldValue = (draft, field) => {
    if (
      !draft ||
      !draft.familyData ||
      !draft.familyData.familyMembersList[0][field]
    ) {
      return null;
    }
    return draft.familyData.familyMembersList[0][field];
  };

  getOtherOption = options => {
    if (!options.some(e => e.otherOption)) {
      return null;
    }

    // console.log(options.filter(e => e.otherOption)[0].value);
    return options.filter(e => e.otherOption)[0].value;
  };

  syncDraft = (value, key, setFieldValue) => {
    setFieldValue(key, value);
    this.updateDraft(key, value);
  };

  render() {
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
      phoneNumber: ''
    };

    return (
      <div>
        <TitleBar title={t('views.primaryParticipant')} />
        <div className={classes.topImageContainer}>
          <img alt="" height={60} width={60} src={familyFaceIcon} />
        </div>
        <Container variant="slim">
          <Formik
            initialValues={{
              ...defaultEditingObject,
              ...participant
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              this.updateDraftWithCurrentValues(values);
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
                    required
                    onChange={e =>
                      this.syncDraft(e.target.value, `firstName`, setFieldValue)
                    }
                  />
                  <InputWithFormik
                    label={t('views.family.lastName')}
                    name="lastName"
                    required
                    onChange={e =>
                      this.syncDraft(e.target.value, `lastName`, setFieldValue)
                    }
                  />
                  <AutocompleteWithFormik
                    label={t('views.family.selectGender')}
                    name="gender"
                    rawOptions={surveyConfig.gender}
                    labelKey="text"
                    valueKey="value"
                    required
                    isClearable={false}
                    onChange={e =>
                      this.syncDraft(e ? e.value : '', 'gender', setFieldValue)
                    }
                  />
                  <DatePickerWithFormik
                    label={t('views.family.dateOfBirth')}
                    name="birthDate"
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
                  <InputWithFormik
                    label={t('views.family.documentNumber')}
                    name="documentNumber"
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
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2
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
