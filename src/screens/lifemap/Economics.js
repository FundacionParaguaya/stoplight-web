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
import RadioWithFormik from '../../components/RadioWithFormik';
import BottomSpacer from '../../components/BottomSpacer';
import { withScroller } from '../../components/Scroller';
import {
  shouldShowQuestion,
  familyMemberWillHaveQuestions,
  getConditionalOptions,
  getDraftWithUpdatedEconomic,
  getDraftWithUpdatedFamilyEconomics,
  getDraftWithUpdatedQuestionsCascading
} from '../../utils/conditional-logic';
import CheckboxWithFormik from '../../components/CheckboxWithFormik';

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
    if (shouldShowQuestion(question, currentDraft)) {
      forFamilySchema[question.codeName] = buildValidationForField(question);
    }
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
    const draftQuestion =
      currentDraft.economicSurveyDataList.find(
        e => e.key === question.codeName
      ) || {};

    forFamilyInitial[question.codeName] =
      (Object.prototype.hasOwnProperty.call(draftQuestion, 'value')
        ? draftQuestion.value
        : draftQuestion.multipleValue) || '';
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
      const draftQuestion =
        socioEconomicAnswers.find(e => e.key === question.codeName) || {};

      memberInitial[question.codeName] =
        (Object.prototype.hasOwnProperty.call(draftQuestion, 'value')
          ? draftQuestion.value
          : draftQuestion.multipleValue) || '';
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
    initialValues: {}
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

  updateEconomicAnswerCascading = (
    question,
    value,
    setFieldValue,
    memberIndex
  ) => {
    const { currentSurvey, currentDraft: draftFromProps } = this.props;
    const {
      conditionalQuestions,
      elementsWithConditionsOnThem: { questionsWithConditionsOnThem }
    } = currentSurvey;

    // We get a draft with updated answer
    let currentDraft;
    const keyName = !Array.isArray(value) ? 'value' : 'multipleValue';
    const newAnswer = {
      key: question.codeName,
      [keyName]: value
    };
    if (question.forFamilyMember) {
      currentDraft = getDraftWithUpdatedFamilyEconomics(
        draftFromProps,
        newAnswer,
        memberIndex
      );
    } else {
      currentDraft = getDraftWithUpdatedEconomic(draftFromProps, newAnswer);
    }

    const cleanUpHook = (conditionalQuestion, index) => {
      // Cleanup value from form that won't be displayed
      if (conditionalQuestion.forFamilyMember) {
        if (this.isQuestionInCurrentScreen(conditionalQuestion)) {
          setFieldValue(
            `forFamilyMember.[${index}].[${conditionalQuestion.codeName}]`,
            ''
          );
        }
      } else if (this.isQuestionInCurrentScreen(conditionalQuestion)) {
        setFieldValue(`forFamily.[${conditionalQuestion.codeName}]`, '');
      }
    };

    // If the question has some conditionals on it,
    // execute function that builds a new draft with cascaded clean up
    // applied
    if (questionsWithConditionsOnThem.includes(question.codeName)) {
      console.log(
        `Will evaluate cascading after updating ${
          question.codeName
        } on member ${memberIndex}`
      );
      currentDraft = getDraftWithUpdatedQuestionsCascading(
        currentDraft,
        conditionalQuestions.filter(
          conditionalQuestion =>
            conditionalQuestion.codeName !== question.codeName
        ),
        cleanUpHook
      );
    }

    // Updating formik value for the question that triggered everything
    if (question.forFamilyMember) {
      setFieldValue(
        `forFamilyMember.[${memberIndex}].[${question.codeName}]`,
        value
      );
    } else {
      setFieldValue(`forFamily.[${question.codeName}]`, value);
    }

    this.props.updateDraft(currentDraft);
  };

  render() {
    const { questions, topic, initialValues, initialized } = this.state;
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
        <TitleBar title={topic} progressBar />
        <div className={classes.mainContainer}>
          <Container variant="slim">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={buildValidationSchemaForQuestions(
                questions,
                this.props.currentDraft
              )}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(false);
                this.handleContinue();
              }}
            >
              {({ isSubmitting, setFieldValue, validateForm }) => (
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
                              onChange={value =>
                                this.updateEconomicAnswerCascading(
                                  question,
                                  value ? value.value : '',
                                  setFieldValue
                                )
                              }
                            />
                          );
                        }
                        if (question.answerType === 'radio') {
                          return (
                            <RadioWithFormik
                              label={question.questionText}
                              rawOptions={getConditionalOptions(
                                question,
                                currentDraft
                              )}
                              key={question.codeName}
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
                        }
                        if (question.answerType === 'checkbox') {
                          return (
                            <CheckboxWithFormik
                              key={question.codeName}
                              label={question.questionText}
                              rawOptions={getConditionalOptions(
                                question,
                                currentDraft
                              )}
                              name={`forFamily.[${question.codeName}]`}
                              required={question.required}
                              onChange={multipleValue => {
                                this.updateEconomicAnswerCascading(
                                  question,
                                  multipleValue,
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
                            onChange={e =>
                              this.updateEconomicAnswerCascading(
                                question,
                                _.get(e, 'target.value', ''),
                                setFieldValue
                              )
                            }
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
                                            onChange={value =>
                                              this.updateEconomicAnswerCascading(
                                                question,
                                                value ? value.value : '',
                                                setFieldValue,
                                                index
                                              )
                                            }
                                          />
                                        );
                                      }
                                      if (question.answerType === 'radio') {
                                        return (
                                          <RadioWithFormik
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
                                            required={question.required}
                                            onChange={e => {
                                              this.updateEconomicAnswerCascading(
                                                question,
                                                _.get(e, 'target.value', ''),
                                                setFieldValue,
                                                index
                                              );
                                            }}
                                          />
                                        );
                                      }
                                      if (question.answerType === 'checkbox') {
                                        return (
                                          <CheckboxWithFormik
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
                                            required={question.required}
                                            onChange={multipleValue =>
                                              this.updateEconomicAnswerCascading(
                                                question,
                                                multipleValue,
                                                setFieldValue,
                                                index
                                              )
                                            }
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
                                          onChange={e =>
                                            this.updateEconomicAnswerCascading(
                                              question,
                                              _.get(e, 'target.value', ''),
                                              setFieldValue,
                                              index
                                            )
                                          }
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
    marginTop: theme.spacing(5)
  }
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(withScroller(withSnackbar(Economics))))
);
