import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import withLayout from '../../components/withLayout';
import { updateSurvey } from '../../redux/actions';
import FamilyQuestionForm from './family/FamilyQuestionForm';
import Header from './Header';
import ProgressBar from './ProgressBar';
import Question from './Question';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper,
    padding: '0 12%',
    paddingBottom: '2rem'
  },
  questionContainer: {
    zIndex: 9,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    border: `2px dashed ${theme.palette.grey.quarter}`,
    marginBottom: '1rem'
  },
  divider: {
    flexGrow: 0,
    border: `1px solid ${theme.palette.grey.quarter}`,
    width: '100%'
  },
  buttonContainer: {
    marginTop: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const FamilyDetails = ({ user, currentSurvey, updateSurvey }) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');

  useEffect(() => {
    const surveyConfig = currentSurvey.surveyConfig || {};
    let primaryQuestions = [];
    const questionProperties = { required: true, answerType: 'select' };
    let genderOptions = (surveyConfig.gender || []).filter(
      option => !option.otherOption
    );
    let documentOptions = (surveyConfig.documentType || []).filter(
      option => !option.otherOption
    );
    primaryQuestions.push({
      ...questionProperties,
      codeName: 'gender',
      questionText: t('views.family.selectGender'),
      options: genderOptions,
      otherOption: !!(surveyConfig.gender || []).find(o => o.otherOption)
    });
    primaryQuestions.push({
      ...questionProperties,
      codeName: 'documentType',
      questionText: t('views.family.documentType'),
      options: documentOptions,
      otherOption: !!(surveyConfig.documentType || []).find(o => o.otherOption)
    });
    setQuestions(primaryQuestions);
  }, [language]);

  const updateSurveyDraft = (genderOptions, documentOptions) => {
    const surveyConfig = {
      ...currentSurvey.surveyConfig,
      gender: genderOptions,
      documentType: documentOptions
    };
    updateSurvey({ ...currentSurvey, surveyConfig });
  };

  const updateQuestion = (index, question) => {
    let newQuestions = Array.from(questions);
    newQuestions[index] = question;
    setQuestions(newQuestions);
    updateSurveyDraft(newQuestions[0].options, newQuestions[1].options);
  };

  const onSave = () => {
    setLoading(true);
    let genderOptions = questions[0].options;
    questions[0].otherOption &&
      genderOptions.push({
        value: 'OTHER',
        text: t('general.other'),
        otherOption: true
      });
    let documentOptions = questions[1].options;
    questions[1].otherOption &&
      documentOptions.push({
        value: 'OTHER',
        text: t('general.other'),
        otherOption: true
      });
    if (genderOptions.length > 0 && documentOptions.length > 0) {
      updateSurveyDraft(genderOptions, documentOptions);
      history.push('/survey-builder/economics');
    } else {
      enqueueSnackbar(t('views.surveyBuilder.optionValidationError'), {
        variant: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <ProgressBar />
      <div className={classes.mainContainer}>
        <Header title={t('views.familyProfile.familyDetails')} />
        <div className={classes.questionContainer}>
          {questions.map((question, index) => (
            <React.Fragment key={index}>
              {question.codeName === selectedQuestion ? (
                <FamilyQuestionForm
                  question={question}
                  updateQuestion={question => updateQuestion(index, question)}
                  afterSubmit={() => setSelectedQuestion('')}
                />
              ) : (
                <Question
                  order={index + 1}
                  question={question}
                  setSelectedQuestion={setSelectedQuestion}
                />
              )}
              {index % 2 === 0 && <div className={classes.divider} />}
            </React.Fragment>
          ))}
        </div>
        <div className={classes.buttonContainer}>
          <Button
            color="primary"
            variant="contained"
            disabled={loading}
            onClick={() => onSave()}
          >
            {t('general.saveQuestions')}
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ currentSurvey, user }) => ({
  currentSurvey,
  user
});

const mapDispatchToProps = { updateSurvey };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLayout(FamilyDetails));
