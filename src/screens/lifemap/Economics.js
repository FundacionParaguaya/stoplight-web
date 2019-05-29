import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import * as _ from 'lodash';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputWithFormik from '../../components/InputWithFormik';
import AutocompleteWithFormik from '../../components/AutocompleteWithFormik';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import { withScroller } from '../../components/Scroller';
import {
  shouldShowQuestion,
  familyMemberWillHaveQuestions,
  getConditionalOptions,
  shouldCleanUp
} from '../../utils/conditional-logic';

let FamilyMemberTitle = ({ name, classes }) => (
  <div className={classes.familyMemberNameLarge}>
    <Typography className={classes.familyMemberTypography} variant="h6">
      <span className={classes.familyMemberTitle}>
        <i className={`material-icons ${classes.familyMemberIcon}`}>face</i>
        {name}
      </span>
    </Typography>
  </div>
);

const familyMemberTitleStyles = {
  familyMemberNameLarge: {
    marginTop: '15px',
    marginBottom: '-10px',
    fontSize: '23px'
  },
  familyMemberTypography: {
    marginTop: '20px',
    marginBottom: '16px'
  },
  familyMemberTitle: {
    display: 'flex',
    alignItems: 'center'
  },
  familyMemberIcon: {
    marginRight: 7,
    fontSize: 35,
    color: '#909090'
  }
};

FamilyMemberTitle = withStyles(familyMemberTitleStyles)(FamilyMemberTitle);

const fieldIsRequired = 'validation.fieldIsRequired';
// const fieldIsNumber = 'validation.validNumber';
const buildValidationForField = question => {
  let validation = Yup.string();
  if (question.required) {
    validation = validation.required(fieldIsRequired);
  }
  return validation;
};

/**
 * Builds the validation schema that will be used by Formik
 * @param {*} questions The list of economic questions for the current screen
 * @param {*} currentDraft the current draft from redux state
 */
const buildValidationSchemaForQuestions = (questions, currentDraft) => {
  const forFamilySchema = {};
  const familyQuestions = (questions && questions.forFamily) || [];

  familyQuestions.forEach(question => {
    forFamilySchema[question.codeName] = buildValidationForField(question);
  });

  const forFamilyMemberSchema = {};
  const familyMemberQuestions = (questions && questions.forFamilyMember) || [];
  const familyMembersList = _.get(
    currentDraft,
    'familyData.familyMembersList',
    []
  );

  familyMembersList.forEach((_member, index) => {
    const memberScheme = {};
    familyMemberQuestions.forEach(question => {
      if (shouldShowQuestion(question, currentDraft, index)) {
        memberScheme[question.codeName] = buildValidationForField(question);
      }
    });
    forFamilyMemberSchema[index] = Yup.object().shape({
      ...memberScheme
    });
  });
  const validationSchema = Yup.object().shape({
    forFamily: Yup.object().shape(forFamilySchema),
    forFamilyMember: Yup.object().shape(forFamilyMemberSchema)
  });
  return validationSchema;
};

/**
 * Based on the current draft, builds the initial values of the economics section
 * @param {*} questions The list of economic questions for the current screen
 * @param {*} currentDraft the current draft from redux state
 */
const buildInitialValuesForForm = (questions, currentDraft) => {
  const forFamilyInitial = {};
  const familyQuestions = (questions && questions.forFamily) || [];

  familyQuestions.forEach(question => {
    forFamilyInitial[question.codeName] =
      (
        currentDraft.economicSurveyDataList.find(
          e => e.key === question.codeName
        ) || {}
      ).value || '';
  });

  const forFamilyMemberInitial = {};
  const familyMemberQuestions = (questions && questions.forFamilyMember) || [];
  const familyMembersList = _.get(
    currentDraft,
    'familyData.familyMembersList',
    []
  );
  familyMembersList.forEach((familyMember, index) => {
    const memberInitial = {};
    const socioEconomicAnswers = familyMember.socioEconomicAnswers || [];
    familyMemberQuestions.forEach(question => {
      memberInitial[question.codeName] =
        (socioEconomicAnswers.find(e => e.key === question.codeName) || {})
          .value || '';
    });
    forFamilyMemberInitial[index] = memberInitial;
  });

  return {
    forFamily: forFamilyInitial,
    forFamilyMember: forFamilyMemberInitial
  };
};

export class Economics extends Component {
  state = {
    questions: null,
    initialized: false,
    topic: '',
    initialValues: {},
    validationSpec: {}
  };

  handleContinue = shouldReplace => {
    const currentEconomicsPage = this.props.match.params.page;

    if (
      currentEconomicsPage <
      this.props.currentSurvey.economicScreens.questionsPerScreen.length - 1
    ) {
      if (shouldReplace) {
        this.props.history.replace(
          `/lifemap/economics/${parseInt(currentEconomicsPage, 10) + 1}`
        );
      } else {
        this.props.history.push(
          `/lifemap/economics/${parseInt(currentEconomicsPage, 10) + 1}`
        );
      }
    } else if (shouldReplace) {
      this.props.history.replace('/lifemap/begin-stoplight');
    } else {
      this.props.history.push('/lifemap/begin-stoplight');
    }
  };

  updateFamilyMember = (value, question, index) => {
    const { currentDraft } = this.props;
    const { familyMembersList } = this.props.currentDraft.familyData;
    let update = false;
    // CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    const familyMember = familyMembersList[index];
    familyMember.socioEconomicAnswers.forEach(e => {
      if (e.key === question.codeName) {
        update = true;
        e.value = value;
      }
    });
    if (update) {
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          familyMembersList
        }
      });
    } else {
      familyMember.socioEconomicAnswers.push({
        key: question.codeName,
        value
      });
      // add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          familyMembersList
        }
      });
    }
  };

  setCurrentScreen() {
    const questions = this.props.currentSurvey.economicScreens
      .questionsPerScreen[this.props.match.params.page];
    // If we only have family members questions, we have to validate
    // if we'll show at least one question for at least one of the
    // members. Otherwise, we should just go to the next page
    if (
      !(questions.forFamily && questions.forFamily.length > 0) &&
      questions.forFamilyMember &&
      questions.forFamilyMember.length > 0
    ) {
      const { familyMembersList } = this.props.currentDraft.familyData;
      let atLeastOneMemberHasQuestions = false;
      familyMembersList.forEach((_member, index) => {
        atLeastOneMemberHasQuestions =
          atLeastOneMemberHasQuestions ||
          familyMemberWillHaveQuestions(
            questions,
            this.props.currentDraft,
            index
          );
      });
      if (!atLeastOneMemberHasQuestions) {
        this.handleContinue(true);
      }
    }
    this.setState({
      questions,
      topic: questions.forFamily.length
        ? questions.forFamily[0].topic
        : questions.forFamilyMember[0].topic,
      validationSpec: buildValidationSchemaForQuestions(
        questions,
        this.props.currentDraft
      ),
      initialValues: buildInitialValuesForForm(
        questions,
        this.props.currentDraft
      ),
      initialized: true
    });
  }

  componentDidMount() {
    this.setCurrentScreen();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.page !== this.props.match.params.page) {
      this.setState({ initialized: false });
      this.setCurrentScreen();
    }
  }

  isQuestionInCurrentScreen = question => {
    const {
      questions: { forFamily = [], forFamilyMember = [] }
    } = this.state;
    let isPresent = false;
    const lookIn = question.forFamilyMember ? forFamilyMember : forFamily;

    for (const q of lookIn) {
      if (q.codeName === question.codeName) {
        isPresent = true;
        break;
      }
    }
    return isPresent;
  };

  updateEconomicAnswerCascading = (question, value, setFieldValue) => {
    console.log('UPDATING CASCADING');
    const { currentSurvey, currentDraft } = this.props;
    const { conditionalQuestions } = currentSurvey;
    const {
      economicSurveyDataList,
      familyData: { familyMembersList }
    } = currentDraft;

    const updateEconomicAnswers = (economicAnswers = [], newAnswer) => {
      const answerToUpdate = economicAnswers.find(a => a.key === newAnswer.key);
      if (answerToUpdate) {
        answerToUpdate.value = newAnswer.value;
      } else {
        economicAnswers.push(newAnswer);
      }
      return [...economicAnswers];
    };

    let updatedEconomicAnswers = updateEconomicAnswers(economicSurveyDataList, {
      key: question.codeName,
      value
    });

    const updatedFamilyMembers = [...familyMembersList];
    conditionalQuestions.forEach(conditionalQuestion => {
      if (conditionalQuestion.codeName === question.codeName) {
        // Not necessary to evaluate conditionalQuestion if it's the question
        // we're updating right now
        return;
      }
      if (conditionalQuestion.forFamilyMember) {
        // Checking if we have to cleanup familyMembers socioeconomic answers
        familyMembersList.forEach((member, index) => {
          if (
            shouldCleanUp(
              conditionalQuestion,
              {
                ...currentDraft,
                economicSurveyDataList: updatedEconomicAnswers
              },
              member,
              index
            )
          ) {
            // Cleaning up socioeconomic answer for family member
            updatedFamilyMembers[index].socioEconomicAnswers.find(
              ea => ea.key === conditionalQuestion.codeName
            ).value = '';
            if (this.isQuestionInCurrentScreen(conditionalQuestion)) {
              setFieldValue(
                `forFamilyMember.[${index}].[${conditionalQuestion.codeName}]`,
                ''
              );
            }
          }
        });
      } else if (
        shouldCleanUp(conditionalQuestion, {
          ...currentDraft,
          economicSurveyDataList: updatedEconomicAnswers
        })
      ) {
        // Cleanup value that won't be displayed
        updatedEconomicAnswers = updateEconomicAnswers(updatedEconomicAnswers, {
          key: conditionalQuestion.codeName,
          value: ''
        });
        if (this.isQuestionInCurrentScreen(conditionalQuestion)) {
          setFieldValue(`forFamily.[${conditionalQuestion.codeName}]`, '');
        }
      }
    });

    // Updating formik value for the question that triggered everything
    setFieldValue(`forFamily.[${question.codeName}]`, value);
    this.props.updateDraft({
      ...currentDraft,
      economicSurveyDataList: updatedEconomicAnswers,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: updatedFamilyMembers
      }
    });
  };

  render() {
    const {
      questions,
      topic,
      validationSpec,
      initialValues,
      initialized
    } = this.state;
    const {
      t,
      currentDraft,
      classes,
      scrollToTop,
      enqueueSnackbar,
      closeSnackbar
    } = this.props;
    if (!initialized) {
      return <TitleBar title={topic} />;
    }
    return (
      <React.Fragment>
        <TitleBar title={topic} />
        <div className={classes.mainContainer}>
          <Container variant="slim">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSpec}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                this.handleContinue();
              }}
            >
              {({
                handleChange,
                isSubmitting,
                setFieldValue,
                validateForm
              }) => (
                <Form noValidate>
                  <React.Fragment>
                    {/* List of questions for current topic */}

                    {questions &&
                      questions.forFamily &&
                      questions.forFamily.length > 0 &&
                      questions.forFamily.map(question => {
                        if (!shouldShowQuestion(question, currentDraft)) {
                          return <React.Fragment key={question.codeName} />;
                        }
                        if (question.answerType === 'select') {
                          return (
                            <AutocompleteWithFormik
                              key={question.codeName}
                              label={question.questionText}
                              name={`forFamily.[${question.codeName}]`}
                              rawOptions={getConditionalOptions(
                                question,
                                currentDraft
                              )}
                              labelKey="text"
                              valueKey="value"
                              required={question.required}
                              isClearable={!question.required}
                              onChange={value => {
                                this.updateEconomicAnswerCascading(
                                  question,
                                  value ? value.value : '',
                                  setFieldValue
                                );
                              }}
                            />
                          );
                        }
                        return (
                          <InputWithFormik
                            key={question.codeName}
                            label={question.questionText}
                            type={
                              question.answerType === 'string'
                                ? 'text'
                                : question.answerType
                            }
                            name={`forFamily.[${question.codeName}]`}
                            required={question.required}
                            onChange={e => {
                              this.updateEconomicAnswerCascading(
                                question,
                                _.get(e, 'target.value', ''),
                                setFieldValue
                              );
                            }}
                          />
                        );
                      })}

                    {questions &&
                      questions.forFamilyMember &&
                      questions.forFamilyMember.length > 0 && (
                        <React.Fragment>
                          {currentDraft.familyData.familyMembersList.map(
                            (familyMember, index) => {
                              const willShowQuestions = familyMemberWillHaveQuestions(
                                questions,
                                currentDraft,
                                index
                              );
                              if (!willShowQuestions) {
                                return (
                                  <React.Fragment
                                    key={familyMember.firstName}
                                  />
                                );
                              }
                              return (
                                <React.Fragment key={familyMember.firstName}>
                                  <FamilyMemberTitle
                                    name={`${
                                      familyMember.firstName
                                    } ${familyMember.lastName || ''}`}
                                  />
                                  <React.Fragment>
                                    {questions.forFamilyMember.map(question => {
                                      if (
                                        !shouldShowQuestion(
                                          question,
                                          currentDraft,
                                          index
                                        )
                                      ) {
                                        return (
                                          <React.Fragment
                                            key={question.codeName}
                                          />
                                        );
                                      }
                                      if (question.answerType === 'select') {
                                        return (
                                          <AutocompleteWithFormik
                                            key={question.codeName}
                                            label={question.questionText}
                                            name={`forFamilyMember.[${index}].[${
                                              question.codeName
                                            }]`}
                                            rawOptions={getConditionalOptions(
                                              question,
                                              currentDraft,
                                              index
                                            )}
                                            labelKey="text"
                                            valueKey="value"
                                            required={question.required}
                                            isClearable={!question.required}
                                            onChange={value => {
                                              setFieldValue(
                                                `forFamilyMember.[${index}].[${
                                                  question.codeName
                                                }]`,
                                                value ? value.value : ''
                                              );
                                              this.updateFamilyMember(
                                                value ? value.value : '',
                                                question,
                                                index
                                              );
                                            }}
                                          />
                                        );
                                      }
                                      return (
                                        <InputWithFormik
                                          key={question.codeName}
                                          label={question.questionText}
                                          type={
                                            question.answerType === 'string'
                                              ? 'text'
                                              : question.answerType
                                          }
                                          name={`forFamilyMember.[${index}].[${
                                            question.codeName
                                          }]`}
                                          required={question.required}
                                          onChange={e => {
                                            handleChange(e);
                                            this.updateFamilyMember(
                                              e.target.value,
                                              question,
                                              index
                                            );
                                          }}
                                        />
                                      );
                                    })}
                                  </React.Fragment>
                                </React.Fragment>
                              );
                            }
                          )}
                        </React.Fragment>
                      )}
                    <div className={classes.buttonContainerForm}>
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                        onClick={() => {
                          validateForm().then(validationErrors => {
                            const forFamilyErrors =
                              validationErrors.forFamily || {};
                            const forFamilyErrorsCount = Object.keys(
                              forFamilyErrors || {}
                            ).length;

                            const forFamilyMemberErrors =
                              validationErrors.forFamilyMember || [];
                            let forFamilyMemberErrorsCount = 0;
                            forFamilyMemberErrors.forEach(fm => {
                              forFamilyMemberErrorsCount += Object.keys(
                                fm || {}
                              ).length;
                            });
                            const errorsLength =
                              forFamilyErrorsCount + forFamilyMemberErrorsCount;
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
                  </React.Fragment>
                </Form>
              )}
            </Formik>
          </Container>
          <BottomSpacer />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateDraft };
const styles = theme => ({
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  },
  mainContainer: {
    marginTop: theme.spacing.unit * 5
  }
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(withScroller(withSnackbar(Economics))))
);
