import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateSurvey } from '../../../redux/actions';
import { COLORS } from '../../../theme';
import EditQuestion from '../EditQuestion';
import Question from '../Question';

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
  tabsRoot: {
    position: 'relative',
    zIndex: 10,
    marginBottom: -4,
    width: 'fit-content',
    marginTop: '1rem',
    backgroundColor: theme.palette.background.default,
    '& $div > span': {
      backgroundColor: theme.palette.primary.dark,
      height: 4
    },
    '& $div >.MuiTabs-flexContainer': {
      justifyContent: 'space-between'
    }
  },
  tabRoot: {
    minHeight: 50,
    maxWidth: 300,
    padding: '5px 15px',
    color: theme.typography.h4.color,
    height: 'auto',
    width: 'auto',
    backgroundColor: theme.palette.background.default,
    '&.MuiTab-textColorSecondary.Mui-selected': {
      color: theme.typography.h4.color
    },
    '&.MuiTab-textColorSecondary.MuiTab-fullWidth': {
      borderBottom: `1px solid ${theme.palette.grey.quarter}`
    }
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 500,
    textTransform: 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  surveyQuestions: {
    zIndex: 1,
    position: 'relative',
    border: `2px dashed ${theme.palette.grey.quarter}`,
    backgroundColor: theme.palette.background.default,
    padding: '1rem'
  },
  topicButton: {
    backgroundColor: COLORS.MEDIUM_GREY,
    marginBottom: 6
  }
}));

const EconomicLibrary = ({
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
  toggleTopicForm
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    let data = [];
    if (surveyTopics.length === 0) {
      currentSurvey.surveyEconomicQuestions.forEach((question, index) => {
        let topicIndex = data.findIndex(t => t.text === question.topic);
        if (topicIndex < 0) {
          data.push({ value: data.length, text: question.topic, audioUrl: '' });
        }
      });
      setSelectedSurveyTopic(data[0]);
      setSurveyTopics(data);
    }
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
        <Tabs
          value={selectedSurveyTopic.value}
          onChange={(event, value) =>
            setSelectedSurveyTopic(surveyTopics.find(s => s.value === value))
          }
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: classes.tabsRoot }}
        >
          {surveyTopics.map((topic, index) => (
            <Tab
              key={index}
              classes={{ root: classes.tabRoot }}
              label={
                <Typography variant="h6" className={classes.tabTitle}>
                  {topic.text}
                </Typography>
              }
              value={topic.value}
            />
          ))}
        </Tabs>
        <Button
          color="primary"
          variant="contained"
          className={classes.topicButton}
          onClick={() => toggleTopicForm()}
        >
          {t('views.surveyBuilder.economic.editTopic')}
        </Button>
      </div>
      {!!selectedSurveyTopic && (
        <Droppable droppableId="survey">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classes.surveyQuestions}
            >
              {Array.isArray(currentSurvey.surveyEconomicQuestions) &&
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
                            <EditQuestion
                              itemRef={provided.innerRef}
                              draggableProps={{
                                ...provided.draggableProps,
                                ...provided.dragHandleProps
                              }}
                              question={question}
                              updateQuestion={question =>
                                updateQuestion(question)
                              }
                              isEconomic
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

const mapStateToProps = ({ user, currentSurvey }) => ({ user, currentSurvey });

const mapDispatchToProps = { updateSurvey };

export default connect(mapStateToProps, mapDispatchToProps)(EconomicLibrary);
