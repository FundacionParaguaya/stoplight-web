import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Form, Formik } from 'formik';
import * as _ from 'lodash';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useParams } from 'react-router-dom';
import { getFamily, getSurveyById, updateEconomicData } from '../../../api';
import familyFaceIcon from '../../../assets/family_face_large.png';
import AutocompleteWithFormik from '../../../components/AutocompleteWithFormik';
import BottomSpacer from '../../../components/BottomSpacer';
import CheckboxWithFormik from '../../../components/CheckboxWithFormik';
import Container from '../../../components/Container';
import ExitModal from '../../../components/ExitModal';
import InputWithDep from '../../../components/InputWithDep';
import InputWithFormik from '../../../components/InputWithFormik';
import RadioWithFormik from '../../../components/RadioWithFormik';
import withLayout from '../../../components/withLayout';
import {
  familyMemberWillHaveQuestions,
  getConditionalOptions,
  getDraftWithUpdatedEconomic,
  getDraftWithUpdatedFamilyEconomics,
  getDraftWithUpdatedQuestionsCascading,
  shouldShowQuestion
} from '../../../utils/conditional-logic';
import {
  buildInitialValuesForForm,
  buildValidationSchemaForQuestions,
  capitalize,
  getConditionalQuestions,
  getElementsWithConditionsOnThem
} from '../../../utils/survey-utils';

const useStyles = makeStyles(theme => ({
  titleContainer: {
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
  memberTitleContainer: {
    marginTop: '15px',
    marginBottom: '-10px',
    fontSize: '23px'
  },
  memberTitle: {
    marginLeft: 10,
    fontWeight: 500
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 40
  }
}));

const isQuestionInCurrentScreen = (question, questionsFromProps) => {
  const { forFamily = [], forFamilyMember = [] } = questionsFromProps;
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

const EditEconomicForm = ({
  user,
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { familyId, topic } = useParams();
  topic = topic.replace(/%2F/g, '/');

  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({
    economicSurveyDataList: [],
    familyData: {
      familyMembersList: []
    }
  });
  const [survey, setSurvey] = useState({});
  const [questions, setQuestions] = useState({
    forFamily: [],
    forFamilyMember: []
  });
  const [openExitModal, setOpenExitModal] = useState(false);
  const [snapshotId, setSnapshotId] = useState();

  const updateEconomicAnswerCascading = (
    question,
    value,
    setFieldValue,
    memberIndex
  ) => {
    const {
      conditionalQuestions,
      elementsWithConditionsOnThem: { questionsWithConditionsOnThem }
    } = survey;

    const hasOtherOption = question.codeName.match(/^custom/g);

    // We get a draft with updated answer
    let key = question.codeName;
    let currentDraft;
    const keyName = !Array.isArray(value) ? 'value' : 'multipleValue';
    let newAnswer = {
      key,
      [keyName]: value
    };

    if (hasOtherOption) {
      key = _.camelCase(question.codeName.replace(/^custom/g, ''));
      newAnswer = {
        key,
        [keyName]: question.options.find(o => o.otherOption).value,
        other: value
      };
    }

    if (question.forFamilyMember) {
      currentDraft = getDraftWithUpdatedFamilyEconomics(
        draft,
        newAnswer,
        memberIndex
      );
    } else {
      currentDraft = getDraftWithUpdatedEconomic(draft, newAnswer);
    }

    const cleanUpHook = (conditionalQuestion, index) => {
      // Cleanup value from form that won't be displayed
      if (conditionalQuestion.forFamilyMember) {
        if (isQuestionInCurrentScreen(conditionalQuestion, questions)) {
          setFieldValue(
            `forFamilyMember.[${index}].[${conditionalQuestion.codeName}]`,
            ''
          );
        }
      } else if (isQuestionInCurrentScreen(conditionalQuestion, questions)) {
        setFieldValue(`forFamily.[${conditionalQuestion.codeName}]`, '');
      }
    };

    // If the question has some conditionals on it,
    // execute function that builds a new draft with cascaded clean up
    // applied
    if (questionsWithConditionsOnThem.includes(question.codeName)) {
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

    setDraft(currentDraft);
  };

  const handleContinue = () => {
    setLoading(true);
    let sanitazedDraft = draft;
    sanitazedDraft.economicSurveyDataList = sanitazedDraft.economicSurveyDataList
      .filter(question => !!question.value || !!question.multipleValue)
      .map(question => {
        !!question.value
          ? delete question.multipleValue
          : delete question.value;
        delete question.text;
        return question;
      });
    sanitazedDraft.familyData.familyMembersList = sanitazedDraft.familyData.familyMembersList.map(
      member => {
        member.socioEconomicAnswers = member.socioEconomicAnswers
          .filter(question => !!question.value || !!question.multipleValue)
          .map(question => {
            delete question.text;
            return question;
          });
        return member;
      }
    );
    updateEconomicData(user, snapshotId, sanitazedDraft)
      .then(() => {
        enqueueSnackbar(t('views.familyProfile.form.saveEconomic.success'), {
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
        enqueueSnackbar(t('views.familyProfile.form.saveEconomic.failed'), {
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
        let familyMembers = family.familyMemberDTOList.map(member => {
          let memberAnswers = family.membersEconomic.find(
            mEconomics =>
              mEconomics.memberIdentifier === member.memberIdentifier
          );
          let memberDraft = !!memberAnswers
            ? memberAnswers.economic.map(question => ({
                key: question.codeName,
                value: question.value,
                multipleValue: question.multipleValue
              }))
            : [];
          member.socioEconomicAnswers = memberDraft;
          return member;
        });

        let economicDraft = family.snapshotEconomics.map(question => ({
          key: question.codeName,
          value: question.value,
          multipleValue: question.multipleValueArray,
          text: question.text
        }));
        setSnapshotId(family.lastSnapshot);
        setDraft({
          economicSurveyDataList: economicDraft,
          familyData: {
            familyMembersList: familyMembers
          }
        });
        getSurveyById(user, family.snapshotIndicators.surveyId).then(
          response => {
            let survey = response.data.data.surveyById;
            const conditionalQuestions = getConditionalQuestions(survey);
            const elementsWithConditionsOnThem = getElementsWithConditionsOnThem(
              conditionalQuestions
            );
            setSurvey({
              ...survey,
              conditionalQuestions,
              elementsWithConditionsOnThem
            });
            let familyQuestions = survey.surveyEconomicQuestions.filter(
              question => question.topic === topic && !question.forFamilyMember
            );
            let familyMemberQuestions = survey.surveyEconomicQuestions.filter(
              question => question.topic === topic && question.forFamilyMember
            );

            setQuestions({
              forFamily: familyQuestions,
              forFamilyMember: familyMemberQuestions
            });
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

          <div className={classes.titleContainer}>
            <Typography className={classes.leaveModalTitle} variant="h5">
              {topic}
            </Typography>
          </div>
          <Container variant="slim">
            <Formik
              initialValues={buildInitialValuesForForm(questions, draft)}
              validationSchema={buildValidationSchemaForQuestions(
                questions,
                draft
              )}
              onSubmit={values => {
                handleContinue(values);
              }}
            >
              {({ values, isSubmitting, setFieldValue, validateForm }) => (
                <Form noValidate>
                  {questions &&
                    questions.forFamily &&
                    questions.forFamily.length > 0 &&
                    questions.forFamily.map(question => {
                      const hasOtherOption = question.options.find(
                        o => o.otherOption
                      );
                      const modifiedQuestion = hasOtherOption
                        ? {
                            ...question,
                            codeName: `custom${capitalize(question.codeName)}`
                          }
                        : null;
                      const cleanUp = value => {
                        updateEconomicAnswerCascading(
                          modifiedQuestion,
                          '',
                          setFieldValue
                        );
                        updateEconomicAnswerCascading(
                          question,
                          value,
                          setFieldValue
                        );
                      };

                      if (!shouldShowQuestion(question, draft)) {
                        return <React.Fragment key={question.codeName} />;
                      }

                      if (question.answerType === 'select') {
                        return (
                          <React.Fragment key={question.codeName}>
                            <AutocompleteWithFormik
                              label={question.questionText}
                              name={`forFamily.[${question.codeName}]`}
                              rawOptions={getConditionalOptions(
                                question,
                                draft
                              )}
                              labelKey="text"
                              valueKey="value"
                              required={question.required}
                              isClearable={!question.required}
                              onChange={value =>
                                updateEconomicAnswerCascading(
                                  question,
                                  value ? value.value : '',
                                  setFieldValue
                                )
                              }
                            />
                            <InputWithDep
                              key={`custom${capitalize(question.codeName)}`}
                              dep={question.codeName}
                              from={draft}
                              fieldOptions={question.options}
                              target={`custom${capitalize(question.codeName)}`}
                              isEconomic
                            >
                              {(otherOption, value) =>
                                otherOption === value && (
                                  <InputWithFormik
                                    key={`custom${capitalize(
                                      question.codeName
                                    )}`}
                                    type="text"
                                    label={t('views.survey.specifyOther')}
                                    name={`forFamily.custom${capitalize(
                                      question.codeName
                                    )}`}
                                    required
                                    onChange={e =>
                                      updateEconomicAnswerCascading(
                                        modifiedQuestion,
                                        _.get(e, 'target.value', ''),
                                        setFieldValue
                                      )
                                    }
                                  />
                                )
                              }
                            </InputWithDep>
                          </React.Fragment>
                        );
                      }
                      if (question.answerType === 'radio') {
                        return (
                          <React.Fragment key={question.codeName}>
                            <RadioWithFormik
                              label={question.questionText}
                              rawOptions={getConditionalOptions(
                                question,
                                draft
                              )}
                              key={question.codeName}
                              name={`forFamily.[${question.codeName}]`}
                              required={question.required}
                              onChange={e => {
                                updateEconomicAnswerCascading(
                                  question,
                                  _.get(e, 'target.value', ''),
                                  setFieldValue
                                );
                              }}
                            />
                            <InputWithDep
                              key={`custom${capitalize(question.codeName)}`}
                              dep={question.codeName}
                              from={draft}
                              fieldOptions={question.options}
                              target={`custom${capitalize(question.codeName)}`}
                              isEconomic
                              cleanUp={cleanUp}
                            >
                              {(otherOption, value) =>
                                otherOption === value && (
                                  <InputWithFormik
                                    key={`custom${capitalize(
                                      question.codeName
                                    )}`}
                                    type="text"
                                    label={t('views.survey.specifyOther')}
                                    name={`forFamily.custom${capitalize(
                                      question.codeName
                                    )}`}
                                    onChange={e =>
                                      updateEconomicAnswerCascading(
                                        modifiedQuestion,
                                        _.get(e, 'target.value', ''),
                                        setFieldValue
                                      )
                                    }
                                  />
                                )
                              }
                            </InputWithDep>
                          </React.Fragment>
                        );
                      }
                      if (question.answerType === 'checkbox') {
                        return (
                          <CheckboxWithFormik
                            key={question.codeName}
                            label={question.questionText}
                            rawOptions={getConditionalOptions(question, draft)}
                            name={`forFamily.[${question.codeName}]`}
                            required={question.required}
                            onChange={multipleValue => {
                              updateEconomicAnswerCascading(
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
                            updateEconomicAnswerCascading(
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
                        {draft.familyData.familyMembersList.map(
                          (familyMember, index) => {
                            const willShowQuestions = familyMemberWillHaveQuestions(
                              questions,
                              draft,
                              index
                            );
                            if (!willShowQuestions) {
                              return (
                                <React.Fragment key={familyMember.firstName} />
                              );
                            }
                            return (
                              <React.Fragment key={familyMember.firstName}>
                                <Grid
                                  item
                                  container
                                  md={12}
                                  className={classes.memberTitleContainer}
                                >
                                  <img
                                    alt=""
                                    height={30}
                                    width={30}
                                    src={familyFaceIcon}
                                  />
                                  <Typography
                                    variant="h6"
                                    className={classes.memberTitle}
                                  >
                                    {familyMember.firstName}
                                  </Typography>
                                </Grid>
                                <React.Fragment>
                                  {questions.forFamilyMember.map(question => {
                                    const hasOtherOption = question.options.find(
                                      o => o.otherOption
                                    );
                                    const modifiedQuestion = hasOtherOption
                                      ? {
                                          ...question,
                                          codeName: `custom${capitalize(
                                            question.codeName
                                          )}`
                                        }
                                      : null;
                                    const cleanUp = value => {
                                      updateEconomicAnswerCascading(
                                        modifiedQuestion,
                                        '',
                                        setFieldValue,
                                        index
                                      );
                                      updateEconomicAnswerCascading(
                                        question,
                                        value,
                                        setFieldValue,
                                        index
                                      );
                                    };
                                    if (
                                      !shouldShowQuestion(
                                        question,
                                        draft,
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
                                        <React.Fragment key={question.codeName}>
                                          <AutocompleteWithFormik
                                            label={question.questionText}
                                            name={`forFamilyMember.[${index}].[${question.codeName}]`}
                                            rawOptions={getConditionalOptions(
                                              question,
                                              draft
                                            )}
                                            labelKey="text"
                                            valueKey="value"
                                            required={question.required}
                                            isClearable={!question.required}
                                            onChange={value =>
                                              updateEconomicAnswerCascading(
                                                question,
                                                value ? value.value : '',
                                                setFieldValue,
                                                index
                                              )
                                            }
                                          />
                                          <InputWithDep
                                            key={`custom${capitalize(
                                              question.codeName
                                            )}`}
                                            dep={question.codeName}
                                            index={index || 0}
                                            from={draft}
                                            fieldOptions={question.options}
                                            isEconomic
                                            target={`forFamilyMember.[${index}].[custom${capitalize(
                                              question.codeName
                                            )}]`}
                                            cleanUp={cleanUp}
                                            onChange={value =>
                                              updateEconomicAnswerCascading(
                                                question,
                                                value ? value.value : '',
                                                setFieldValue,
                                                index
                                              )
                                            }
                                          >
                                            {(otherOption, value) =>
                                              otherOption === value && (
                                                <InputWithFormik
                                                  type="text"
                                                  label={t(
                                                    'views.survey.specifyOther'
                                                  )}
                                                  name={`forFamilyMember.[${index}].[custom${capitalize(
                                                    question.codeName
                                                  )}]`}
                                                  required
                                                  onChange={e =>
                                                    setFieldValue(
                                                      `forFamilyMember.[${index}].[${question.codeName}].otherValue`,
                                                      e
                                                    )
                                                  }
                                                />
                                              )
                                            }
                                          </InputWithDep>
                                        </React.Fragment>
                                      );
                                    }
                                    if (question.answerType === 'radio') {
                                      return (
                                        <React.Fragment key={question.codeName}>
                                          <RadioWithFormik
                                            label={question.questionText}
                                            name={`forFamilyMember.[${index}].[${question.codeName}]`}
                                            rawOptions={getConditionalOptions(
                                              question,
                                              draft,
                                              index
                                            )}
                                            required={question.required}
                                            onChange={e => {
                                              updateEconomicAnswerCascading(
                                                question,
                                                _.get(e, 'target.value', ''),
                                                setFieldValue,
                                                index
                                              );
                                            }}
                                          />
                                          <InputWithDep
                                            key={`custom${capitalize(
                                              question.codeName
                                            )}`}
                                            dep={question.codeName}
                                            index={index || 0}
                                            from={draft}
                                            fieldOptions={question.options}
                                            isEconomic
                                            target={`forFamilyMember.[${index}].[custom${capitalize(
                                              question.codeName
                                            )}]`}
                                            cleanUp={cleanUp}
                                          >
                                            {(otherOption, value) =>
                                              otherOption === value && (
                                                <InputWithFormik
                                                  type="text"
                                                  label={t(
                                                    'views.survey.specifyOther'
                                                  )}
                                                  name={`forFamilyMember.[${index}].[custom${capitalize(
                                                    question.codeName
                                                  )}]`}
                                                  required
                                                  onChange={e =>
                                                    setFieldValue(
                                                      `forFamilyMember.[${index}].[${question.codeName}].otherValue`,
                                                      e
                                                    )
                                                  }
                                                />
                                              )
                                            }
                                          </InputWithDep>
                                        </React.Fragment>
                                      );
                                    }
                                    if (question.answerType === 'checkbox') {
                                      return (
                                        <CheckboxWithFormik
                                          key={question.codeName}
                                          label={question.questionText}
                                          name={`forFamilyMember.[${index}].[${question.codeName}]`}
                                          rawOptions={getConditionalOptions(
                                            question,
                                            draft,
                                            index
                                          )}
                                          required={question.required}
                                          onChange={multipleValue =>
                                            updateEconomicAnswerCascading(
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
                                        name={`forFamilyMember.[${index}].[${question.codeName}]`}
                                        required={question.required}
                                        onChange={e =>
                                          updateEconomicAnswerCascading(
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
                          const forFamilyErrors =
                            validationErrors.forFamily || {};
                          const forFamilyErrorsCount = Object.keys(
                            forFamilyErrors || {}
                          ).length;

                          const forFamilyMemberErrors =
                            validationErrors.forFamilyMember || [];

                          let forFamilyMemberErrorsCount = 0;
                          forFamilyMemberErrors.forEach(fm => {
                            forFamilyMemberErrorsCount += Object.keys(fm || {})
                              .length;
                          });
                          const errorsLength =
                            forFamilyErrorsCount + forFamilyMemberErrorsCount;
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
              )}
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
  withSnackbar(withLayout(EditEconomicForm))
);
