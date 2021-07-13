import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateSurvey } from '../../../redux/actions';
import { COLORS } from '../../../theme';
import PreviewTabs from '../PreviewTabs';
import Question from '../Question';
import EconomicQuestionForm from './EconomicQuestionForm';

const useStyles = makeStyles(theme => ({
  surveyQuestionsContainer: {
    width: '-webkit-fill-available',
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem'
  },
  tabsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  surveyQuestions: {
    zIndex: 1,
    position: 'relative',
    border: `2px dashed ${theme.palette.grey.quarter}`,
    backgroundColor: theme.palette.background.default,
    padding: '1rem'
  },
  topicButton: {
    margin: '6px 0 6px 6px',
    backgroundColor: COLORS.MEDIUM_GREY
  },
  placeHolder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh'
  },
  buttonContainer: {
    marginTop: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const EconomicPreview = ({
  selectedSurveyTopic,
  setSelectedSurveyTopic,
  selectedQuestion,
  setSelectedQuestion,
  setSurveyQuestion,
  goToConditional,
  currentSurvey,
  updateSurvey,
  surveyTopics,
  setSurveyTopics,
  toggleTopicForm,
  handleDeleteTopic,
  onSave
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    let data = [];
    if (surveyTopics.length === 0) {
      currentSurvey.surveyEconomicQuestions.forEach((question, index) => {
        let topicIndex = data.findIndex(t => t.text === question.topic);
        if (topicIndex < 0) {
          data.push({
            value: data.length,
            text: question.topic,
            audioUrl: question.topicAudio
          });
        }
      });
      setSelectedSurveyTopic(data[0] || {});
      setSurveyTopics(data);
    }
    !selectedSurveyTopic &&
      setSelectedSurveyTopic(data[0] || surveyTopics[0] || {});
  }, []);

  const updateQuestion = question => {
    let newQuestions = currentSurvey.surveyEconomicQuestions || [];
    let index = newQuestions.findIndex(q => q.codeName === question.codeName);
    if (index < 0) {
      newQuestions.push(question);
    } else {
      newQuestions[index] = question;
    }
    updateSurvey({ ...currentSurvey, surveyEconomicQuestions: newQuestions });
  };

  const deleteQuestion = codeName => {
    let newQuestions = currentSurvey.surveyEconomicQuestions || [];
    newQuestions = newQuestions.filter(
      question => question.codeName !== codeName
    );
    updateSurvey({ ...currentSurvey, surveyEconomicQuestions: newQuestions });
  };

  return (
    <div className={classes.surveyQuestionsContainer}>
      <Typography variant="h5">
        {t('views.surveyBuilder.economic.socioeconomic')}
      </Typography>
      <div className={classes.tabsContainer}>
        <PreviewTabs
          surveyTopics={surveyTopics}
          selectedSurveyTopic={selectedSurveyTopic}
          setSelectedSurveyTopic={setSelectedSurveyTopic}
        />
        <div>
          <Button
            color="primary"
            variant="contained"
            className={classes.topicButton}
            onClick={() => handleDeleteTopic(selectedSurveyTopic)}
            disabled={
              !selectedSurveyTopic ||
              !Number.isInteger(selectedSurveyTopic.value)
            }
          >
            {t('views.surveyBuilder.economic.deleteTopic')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.topicButton}
            onClick={() => toggleTopicForm()}
            disabled={
              !selectedSurveyTopic ||
              !Number.isInteger(selectedSurveyTopic.value)
            }
          >
            {t('views.surveyBuilder.economic.editTopic')}
          </Button>
        </div>
      </div>

      <Droppable droppableId="survey">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={classes.surveyQuestions}
          >
            {!!selectedSurveyTopic &&
              currentSurvey.surveyEconomicQuestions
                .filter(q => q.topic === selectedSurveyTopic.text)
                .map((question, index) => (
                  <Draggable
                    key={question.codeName}
                    draggableId={question.codeName}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <React.Fragment key={index}>
                        {question.codeName === selectedQuestion ? (
                          <EconomicQuestionForm
                            itemRef={provided.innerRef}
                            draggableProps={{
                              ...provided.draggableProps,
                              ...provided.dragHandleProps
                            }}
                            question={question}
                            updateQuestion={question =>
                              updateQuestion(question)
                            }
                            afterSubmit={() => setSelectedQuestion('')}
                          />
                        ) : (
                          <Question
                            itemRef={provided.innerRef}
                            draggableProps={{
                              ...provided.draggableProps,
                              ...provided.dragHandleProps
                            }}
                            order={index + 1}
                            question={question}
                            setSelectedQuestion={setSelectedQuestion}
                            setSurveyQuestion={() =>
                              setSurveyQuestion(question)
                            }
                            handleDelete={deleteQuestion}
                            goToConditional={goToConditional}
                            isEconomic
                          />
                        )}
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
            {(!selectedSurveyTopic ||
              currentSurvey.surveyEconomicQuestions.filter(
                q => q.topic === selectedSurveyTopic.text
              ).length === 0) && (
              <div className={classes.placeHolder}>
                <Typography variant="h6">
                  {t('views.surveyBuilder.economic.dropHere')}
                </Typography>
              </div>
            )}
          </div>
        )}
      </Droppable>

      <div className={classes.buttonContainer}>
        <Button color="primary" variant="contained" onClick={() => onSave()}>
          {t('general.save')}
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user, currentSurvey }) => ({ user, currentSurvey });

const mapDispatchToProps = { updateSurvey };

export default connect(mapStateToProps, mapDispatchToProps)(EconomicPreview);
