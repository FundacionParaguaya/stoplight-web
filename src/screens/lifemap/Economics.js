import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Autocomplete from '../../components/Autocomplete';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import { withScroller } from '../../components/Scroller';
import { getErrorLabelForPath, pathHasError } from '../../utils/form-utils';

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

const evaluateCondition = (condition, targetQuestion) => {
  const CONDITION_TYPES = {
    EQUALS: 'equals',
    LESS_THAN: 'less_than',
    GREATER_THAN: 'greater_than',
    LESS_THAN_EQ: 'less_than_eq',
    GREATER_THAN_EQ: 'greater_than_eq',
    BETWEEN: 'between'
  };
  if (!targetQuestion) {
    return false;
  }

  if (condition.operator === CONDITION_TYPES.EQUALS) {
    return targetQuestion.value === condition.value;
  }
  if (condition.operator === CONDITION_TYPES.LESS_THAN) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') < condition.value;
    }
    return targetQuestion.value < condition.value;
  }
  if (condition.operator === CONDITION_TYPES.GREATER_THAN) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') > condition.value;
    }
    return targetQuestion.value > condition.value;
  }
  if (condition.operator === CONDITION_TYPES.LESS_THAN_EQ) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') <= condition.value;
    }
    return targetQuestion.value <= condition.value;
  }
  if (condition.operator === CONDITION_TYPES.GREATER_THAN_EQ) {
    if (moment.isMoment(targetQuestion.value)) {
      return moment().diff(targetQuestion.value, 'years') >= condition.value;
    }
    return targetQuestion.value >= condition.value;
  }
  return false;
};

const conditionMet = (condition, currentDraft, memberIndex) => {
  const CONDITION_TYPES = {
    SOCIOECONOMIC: 'socioEconomic',
    FAMILY: 'family'
  };
  const socioEconomicAnswers = currentDraft.economicSurveyDataList || [];
  const { familyMembersList } = currentDraft.familyData;
  let targetQuestion = null;
  if (condition.type === CONDITION_TYPES.SOCIOECONOMIC) {
    // In this case target should be located in the socioeconomic answers
    targetQuestion = socioEconomicAnswers.find(
      element => element.key === condition.codeName
    );
  } else if (condition.type === CONDITION_TYPES.FAMILY) {
    const familyMember = familyMembersList[memberIndex];
    // TODO HARDCODED FOR IRRADIA. WE NEED A BETTER WAY TO SPECIFY THAT THE CONDITION
    // HAS BEEN MADE ON A DATE
    // const value = familyMember[condition.codeName]
    //   ? moment.unix(familyMember[condition.codeName])
    //   : null;
    // TODO hardcoded for Irradia, the survey has an error with the field.
    // The lines above should be used once data is fixed for that survey
    const value = familyMember['birthDate']
      ? moment.unix(familyMember['birthDate'])
      : null;
    targetQuestion = { value };
  }
  return evaluateCondition(condition, targetQuestion);
};

/**
 * Decides whether a question should be shown to the user or not
 * @param {*} question the question we want to know if can be shown
 * @param {*} currentDraft the draft from redux state
 */
const shouldShowQuestion = (question, currentDraft, memberIndex) => {
  let shouldShow = true;
  if (question.conditions && question.conditions.length > 0) {
    question.conditions.forEach(condition => {
      if (!conditionMet(condition, currentDraft, memberIndex)) {
        shouldShow = false;
      }
    });
  }
  return shouldShow;
};

const familyMemberWillHaveQuestions = (
  questions,
  currentDraft,
  memberIndex
) => {
  return questions.forFamilyMember.reduce(
    (acc, current) =>
      acc && shouldShowQuestion(current, currentDraft, memberIndex),
    true
  );
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

  updateDraft = (codeName, value) => {
    const { currentDraft } = this.props;
    const dataList = this.props.currentDraft.economicSurveyDataList;
    let update = false;
    // ////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true;
        e.value = value;
      }
    });

    // /////////if the question is in the data list then update the question
    if (update) {
      const economicSurveyDataList = dataList;
      this.props.updateDraft({
        ...currentDraft,
        economicSurveyDataList
      });
    } else {
      // ////////// add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        economicSurveyDataList: [
          ...currentDraft.economicSurveyDataList,
          {
            key: codeName,
            value
          }
        ]
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
                            <Autocomplete
                              key={question.codeName}
                              name={`forFamily.[${question.codeName}]`}
                              value={{
                                value: values.forFamily[question.codeName],
                                label: values.forFamily[question.codeName]
                                  ? question.options.find(
                                      e =>
                                        e.value ===
                                        values.forFamily[question.codeName]
                                    ).text
                                  : ''
                              }}
                              options={question.options.map(val => ({
                                value: val.value,
                                label: val.text
                              }))}
                              isClearable={!question.required}
                              onChange={value => {
                                setFieldValue(
                                  `forFamily.[${question.codeName}]`,
                                  value ? value.value : ''
                                );
                                this.updateDraft(
                                  question.codeName,
                                  value ? value.value : ''
                                );
                              }}
                              onBlur={() =>
                                setFieldTouched(
                                  `forFamily.[${question.codeName}]`
                                )
                              }
                              textFieldProps={{
                                label: question.questionText,
                                required: question.required,
                                error: pathHasError(
                                  `forFamily.[${question.codeName}]`,
                                  touched,
                                  errors
                                ),
                                helperText: getErrorLabelForPath(
                                  `forFamily.[${question.codeName}]`,
                                  touched,
                                  errors,
                                  t
                                )
                              }}
                            />
                          );
                        }
                        return (
                          <TextField
                            className={this.props.classes.input}
                            key={question.codeName}
                            type={
                              question.answerType === 'string'
                                ? 'text'
                                : question.answerType
                            }
                            variant="filled"
                            label={question.questionText}
                            value={values.forFamily[question.codeName] || ''}
                            name={`forFamily.[${question.codeName}]`}
                            onChange={e => {
                              handleChange(e);
                              this.updateDraft(
                                question.codeName,
                                e.target.value
                              );
                            }}
                            onBlur={handleBlur}
                            required={question.required}
                            error={pathHasError(
                              `forFamily.[${question.codeName}]`,
                              touched,
                              errors
                            )}
                            helperText={getErrorLabelForPath(
                              `forFamily.[${question.codeName}]`,
                              touched,
                              errors,
                              t
                            )}
                            fullWidth
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
                                          <Autocomplete
                                            key={question.codeName}
                                            name={`forFamilyMember.[${index}].[${
                                              question.codeName
                                            }]`}
                                            value={{
                                              value:
                                                values.forFamilyMember[index][
                                                  question.codeName
                                                ],
                                              label: values.forFamilyMember[
                                                index
                                              ][question.codeName]
                                                ? question.options.find(
                                                    e =>
                                                      e.value ===
                                                      values.forFamilyMember[
                                                        index
                                                      ][question.codeName]
                                                  ).text
                                                : ''
                                            }}
                                            options={question.options.map(
                                              val => ({
                                                value: val.value,
                                                label: val.text
                                              })
                                            )}
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
                                            onBlur={() =>
                                              setFieldTouched(
                                                `forFamilyMember.[${index}].[${
                                                  question.codeName
                                                }]`
                                              )
                                            }
                                            textFieldProps={{
                                              label: question.questionText,
                                              required: question.required,
                                              error: pathHasError(
                                                `forFamilyMember.[${index}].[${
                                                  question.codeName
                                                }]`,
                                                touched,
                                                errors
                                              ),
                                              helperText: getErrorLabelForPath(
                                                `forFamilyMember.[${index}].[${
                                                  question.codeName
                                                }]`,
                                                touched,
                                                errors,
                                                t
                                              )
                                            }}
                                          />
                                        );
                                      }
                                      return (
                                        <TextField
                                          className={this.props.classes.input}
                                          key={question.codeName}
                                          type={
                                            question.answerType === 'string'
                                              ? 'text'
                                              : question.answerType
                                          }
                                          variant="filled"
                                          label={question.questionText}
                                          value={
                                            values.forFamilyMember[index][
                                              question.codeName
                                            ] || ''
                                          }
                                          name={`forFamilyMember.[${index}].[${
                                            question.codeName
                                          }]`}
                                          onChange={e => {
                                            handleChange(e);
                                            this.updateFamilyMember(
                                              e.target.value,
                                              question,
                                              index
                                            );
                                          }}
                                          onBlur={handleBlur}
                                          required={question.required}
                                          error={pathHasError(
                                            `forFamilyMember.[${index}].[${
                                              question.codeName
                                            }]`,
                                            touched,
                                            errors
                                          )}
                                          helperText={getErrorLabelForPath(
                                            `forFamilyMember.[${index}].[${
                                              question.codeName
                                            }]`,
                                            touched,
                                            errors,
                                            t
                                          )}
                                          fullWidth
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

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(withScroller(withSnackbar(Economics))))
);
