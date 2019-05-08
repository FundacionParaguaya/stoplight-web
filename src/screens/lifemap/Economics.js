import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as _ from 'lodash';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Autocomplete from '../../components/Autocomplete';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
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
const buildValidationSchemaForQuestions = questions => {
  const forFamilySchema = {};
  const familyQuestions = (questions && questions.forFamily) || [];

  familyQuestions.forEach(question => {
    if (question.required) {
      forFamilySchema[question.codeName] = Yup.string().required(
        fieldIsRequired
      );
    }
  });

  const forFamilyMemberSchema = {};
  const validationSchema = Yup.object().shape({
    forFamily: Yup.object().shape(forFamilySchema),
    forFamilyMember: Yup.object().shape(forFamilyMemberSchema)
  });
  return validationSchema;
};

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

  handleContinue = () => {
    // validation happens here

    const currentEconomicsPage = this.props.match.params.page;

    if (
      currentEconomicsPage <
      this.props.currentSurvey.economicScreens.questionsPerScreen.length - 1
    ) {
      this.props.history.push(
        `/lifemap/economics/${parseInt(currentEconomicsPage, 10) + 1}`
      );
    } else {
      this.props.history.push('/lifemap/begin-stoplight');
    }
  };

  updateFamilyMember = (codeName, value, question, familyName) => {
    const { currentDraft } = this.props;
    const FamilyMembersDataList = this.props.currentDraft.familyData
      .familyMembersList;
    let update = false;
    // CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    FamilyMembersDataList.forEach(e => {
      if (e.firstName === familyName) {
        // eslint-disable-next-line no-shadow
        e.socioEconomicAnswers.forEach(e => {
          if (e.key === question.codeName) {
            update = true;
            e.value = value;
          }
        });
      }
    });
    if (update) {
      const familyMembersList = FamilyMembersDataList;
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          familyMembersList
        }
      });
    } else {
      const familyMembersList = FamilyMembersDataList;
      FamilyMembersDataList.forEach(e => {
        if (e.firstName === familyName) {
          e.socioEconomicAnswers.push({
            key: question.codeName,
            value
          });
        }
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

    this.setState({
      questions,
      topic: questions.forFamily.length
        ? questions.forFamily[0].topic
        : questions.forFamilyMember[0].topic,
      validationSpec: buildValidationSchemaForQuestions(questions),
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
    const { t, currentDraft, classes } = this.props;
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
                setFieldTouched
              }) => (
                <Form noValidate>
                  <React.Fragment>
                    {/* List of questions for current topic */}

                    {questions &&
                      questions.forFamily &&
                      questions.forFamily.length > 0 &&
                      questions.forFamily.map(question => {
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
                            className={
                              values.forFamily[question.codeName]
                                ? `${this.props.classes.input} ${
                                    this.props.classes.inputFilled
                                  }`
                                : `${this.props.classes.input}`
                            }
                            key={question.codeName}
                            variant="filled"
                            label={question.questionText}
                            value={values.forFamily[question.codeName] || ''}
                            name={`forFamily.[${question.codeName}]`}
                            onChange={handleChange}
                            onBlur={e => {
                              handleBlur(e);
                              this.updateDraft(
                                question.codeName,
                                values.forFamily[question.codeName]
                              );
                            }}
                            required={question.required}
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
                              if (familyMember.firstParticipant) {
                                return (
                                  <React.Fragment
                                    key={familyMember.firstName}
                                  />
                                );
                              }
                              return (
                                <React.Fragment key={familyMember.firstName}>
                                  <FamilyMemberTitle
                                    name={familyMember.firstName}
                                  />
                                  <React.Fragment>
                                    {questions.forFamilyMember.map(question => {
                                      let selectValue;

                                      currentDraft.familyData.familyMembersList[
                                        index
                                      ].socioEconomicAnswers.forEach(ele => {
                                        if (ele.key === question.codeName) {
                                          selectValue = ele.value;
                                        }
                                      });

                                      if (question.answerType === 'select') {
                                        return (
                                          <Select
                                            key={question.codeName}
                                            label={question.questionText}
                                            value={selectValue}
                                            options={question.options}
                                            field={question.codeName}
                                            onChange={(event, child) =>
                                              this.updateFamilyMember(
                                                event,
                                                child,
                                                question,
                                                familyMember.firstName
                                              )
                                            }
                                          />
                                        );
                                      }
                                      return (
                                        <Input
                                          key={question.codeName}
                                          required={question.required}
                                          label={question.questionText}
                                          value={selectValue}
                                          field={question.codeName}
                                          onChange={(event, child) =>
                                            this.updateFamilyMember(
                                              event,
                                              child,
                                              question,
                                              familyMember.firstName
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
  )(withTranslation()(Economics))
);
