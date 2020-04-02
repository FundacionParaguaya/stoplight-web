import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import * as moment from 'moment';
import InputWithFormik from '../../components/InputWithFormik';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import DatePickerWithFormik from '../../components/DatePickerWithFormik';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import { withScroller } from '../../components/Scroller';
import InputWithDep from '../../components/InputWithDep';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import {
  getDraftWithUpdatedMember,
  getDraftWithUpdatedQuestionsCascading
} from '../../utils/conditional-logic';

const fieldIsRequired = 'validation.fieldIsRequired';
const schemaWithDateTransform = Yup.date()
  .typeError(fieldIsRequired)
  .transform((_value, originalValue) => {
    return originalValue ? moment.unix(originalValue).toDate() : new Date();
  });

const validationSchema = Yup.object().shape({
  members: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string().required(fieldIsRequired),
      birthDate: schemaWithDateTransform
    })
  )
});

export class FamilyMembers extends Component {
  updateDraft = (memberIndex, value, property) => {
    const {
      currentDraft,
      currentSurvey,
      enqueueSnackbar,
      closeSnackbar
    } = this.props;
    const {
      conditionalQuestions = [],
      elementsWithConditionsOnThem: { memberKeysWithConditionsOnThem }
    } = currentSurvey;

    let newDraft = getDraftWithUpdatedMember(
      currentDraft,
      property,
      value,
      memberIndex
    );
    if (memberKeysWithConditionsOnThem.includes(property)) {
      console.log(
        `Will evaluate cascading after updating family key ${property} on member ${memberIndex}`
      );
      newDraft = getDraftWithUpdatedQuestionsCascading(
        newDraft,
        conditionalQuestions
      );
    }

    this.props.updateDraft(newDraft);
  };

  handleContinue = () => {
    console.log('handle continue');

    if (this.validateNumberOfMembers()) {
      this.props.history.push('/lifemap/location');
    } else {
      this.props.enqueueSnackbar(this.props.t('views.family.amountOfMembers'), {
        variant: 'error',
        action: key => (
          <IconButton
            key="dismiss"
            onClick={() => this.props.closeSnackbar(key)}
          >
            <CloseIcon style={{ color: 'white' }} />
          </IconButton>
        )
      });
    }
  };

  validateNumberOfMembers = () => {
    const numberOfMembers = this.props.currentDraft.familyData
      .countFamilyMembers; //No first participant
    const numberAdded = this.props.currentDraft.familyData.familyMembersList
      .length;
    console.log(
      'validating number of members: ' + numberOfMembers + ' --- ' + numberAdded
    );
    if (numberOfMembers === numberAdded) {
      console.log('Equal number of members added and declared');
      return true;
    } else if (numberAdded > numberOfMembers) {
      console.log('Updating number of members to : ', numberAdded + 1);

      this.props.updateDraft({
        ...this.props.currentDraft,
        familyData: {
          ...this.props.currentDraft.familyData,
          //...{ countFamilyMembers: value },
          countFamilyMembers: numberAdded + 1
        }
      });
      return true;
    } else {
      return false;
    }
  };
  emptyMember = {
    firstName: '',
    gender: '',
    birthDate: null,
    firstParticipant: false,
    socioEconomicAnswers: []
  };

  addMember = () => {
    console.log('Calling addMember');
    const names2 = this.props.currentDraft.familyData.familyMembersList;
    names2.push(this.emptyMember);
    this.props.updateDraft({
      ...this.props.currentDraft,
      familyData: {
        ...this.props.currentDraft.familyData,
        //...{ countFamilyMembers: value },
        familyMembersList: names2
      }
    });
  };

  removeMember = indexToRemove => {
    console.log('Calling removeMember');
    let members = [];
    if (this.props.currentDraft.familyData.familyMembersList) {
      members = this.props.currentDraft.familyData.familyMembersList.filter(
        (item, index) => index !== indexToRemove + 1
      );
    }
    this.props.updateDraft({
      ...this.props.currentDraft,
      familyData: {
        ...this.props.currentDraft.familyData,
        //...{ countFamilyMembers: value },
        familyMembersList: members
      }
    });
  };

  syncDraft = (value, index, keyInDraft, keyInFormik, setFieldValue) => {
    setFieldValue(keyInFormik, value);
    this.updateDraft(index + 1, value, keyInDraft);
  };

  render() {
    const {
      classes,
      t,
      currentDraft,
      currentSurvey,
      scrollToTop,
      enqueueSnackbar,
      closeSnackbar
    } = this.props;
    const membersList = currentDraft.familyData.familyMembersList.slice(0);
    const { surveyConfig } = currentSurvey;
    console.log('List of members');
    console.log(membersList);

    return (
      <div>
        <TitleBar title={t('views.familyMembers')} progressBar />
        <Container variant="slim">
          <Formik
            initialValues={{
              members: membersList.filter(item => !item.firstParticipant)
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              this.handleContinue();
              setSubmitting(false);
            }}
          >
            {({ values, isSubmitting, setFieldValue, validateForm }) => (
              <Form noValidate>
                <FieldArray
                  name="members"
                  render={arrayHelpers => (
                    <React.Fragment>
                      {values.members.map((item, index) => {
                        //It's index + 2  to make it clear that no family member it's  the first participant
                        return (
                          <div key={index} className={classes.familyMemberForm}>
                            <div className={classes.familyMemberTitle}>
                              <Typography
                                variant="h6"
                                className={classes.title}
                              >
                                <i className={`material-icons ${classes.icon}`}>
                                  face
                                </i>
                                {t('views.family.familyMember')} {index + 2}
                              </Typography>
                              <IconButton
                                color="secondary"
                                aria-label="delete member"
                                component="span"
                                onClick={() => {
                                  this.removeMember(index);
                                  arrayHelpers.remove(index);
                                }}
                              >
                                <HighlightOffIcon />
                              </IconButton>
                            </div>

                            <InputWithFormik
                              label={t('views.family.firstName')}
                              name={`members[${index}].firstName`}
                              required
                              onChange={e =>
                                this.syncDraft(
                                  e.target.value,
                                  index,
                                  'firstName',
                                  `members[${index}].firstName`,
                                  setFieldValue
                                )
                              }
                            />
                            <AutocompleteWithFormik
                              label={t('views.family.selectGender')}
                              name={`members[${index}].gender`}
                              rawOptions={surveyConfig.gender}
                              labelKey="text"
                              valueKey="value"
                              onChange={e =>
                                this.syncDraft(
                                  e ? e.value : '',
                                  index,
                                  'gender',
                                  `members[${index}].gender`,
                                  setFieldValue
                                )
                              }
                            />
                            <InputWithDep
                              dep="gender"
                              from={currentDraft}
                              fieldOptions={surveyConfig.gender}
                              index={index + 1}
                              target={`members[${index}].customGender`}
                              cleanUp={() =>
                                this.syncDraft(
                                  '',
                                  index,
                                  'customGender',
                                  `members[${index}].customGender`,
                                  setFieldValue
                                )
                              }
                            >
                              {(otherOption, value) =>
                                otherOption === value && (
                                  <InputWithFormik
                                    label={`${t('views.family.specify')} ${t(
                                      'views.family.gender'
                                    ).toLowerCase()}`}
                                    name={`members[${index}].customGender`}
                                    onChange={e =>
                                      this.syncDraft(
                                        e.target.value,
                                        index,
                                        'customGender',
                                        `members[${index}].customGender`,
                                        setFieldValue
                                      )
                                    }
                                  />
                                )
                              }
                            </InputWithDep>
                            <DatePickerWithFormik
                              label={t('views.family.dateOfBirth')}
                              name={`members[${index}].birthDate`}
                              maxDate={new Date()}
                              disableFuture
                              minDate={moment('1910-01-01')}
                              onChange={e =>
                                this.syncDraft(
                                  e.unix(),
                                  index,
                                  'birthDate',
                                  `members[${index}].birthDate`,
                                  setFieldValue
                                )
                              }
                            />
                          </div>
                        );
                      })}

                      <div className={classes.buttonAddForm}>
                        <IconButton
                          color="primary"
                          aria-label="add member"
                          component="span"
                          onClick={() => {
                            this.addMember();
                            arrayHelpers.push(this.emptyMember);
                          }}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      </div>
                    </React.Fragment>
                  )}
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
                          const errorsLength = Object.keys(
                            validationErrors.members
                          ).length;
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
        </Container>
        <BottomSpacer />
      </div>
    );
  }
}

const styles = theme => ({
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: 10,
    fontSize: 30,
    color: theme.palette.grey.main
  },
  familyMemberTitle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  familyMemberForm: {
    marginTop: 40
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  },
  buttonAddForm: {
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

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(withScroller(withSnackbar(FamilyMembers))))
);
