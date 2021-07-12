import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PreviewTabs from '../PreviewTabs';
import { updateSurvey } from '../../../redux/actions';
import { COLORS } from '../../../theme';
import StoplightQuestionForm from './StoplightQuestionForm';
import StoplightQuestion from './StoplightQuestion';

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
  button: {
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

const StoplightPreview = ({
  surveyDimensions,
  setSurveyDimensions,
  selectedSurveyDimension,
  setSelectedSurveyDimension,
  selectedQuestion,
  setSelectedQuestion,
  setSurveyQuestion,
  toggleDimensionForm,
  handleDeleteDimension,
  onSave,
  currentSurvey,
  updateSurvey
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    let data = [];
    if (surveyDimensions.length === 0) {
      currentSurvey.surveyStoplightQuestions.forEach((question, index) => {
        let dimensionIndex = data.findIndex(t => t.text === question.dimension);
        if (dimensionIndex < 0) {
          data.push({
            value: data.length,
            text: question.dimension,
            surveyDimensionId: question.surveyStoplightDimension.id
          });
        }
      });
      setSelectedSurveyDimension(data[0] || {});
      setSurveyDimensions(data);
    } else {
      if (!selectedSurveyDimension.value)
        setSelectedSurveyDimension(surveyDimensions[0]);
    }
  }, []);

  const deleteQuestion = codeName => {
    let newIndicators = (currentSurvey.surveyStoplightQuestions || []).filter(
      question => question.codeName !== codeName
    );
    updateSurvey({ ...currentSurvey, surveyStoplightQuestions: newIndicators });
  };

  const updateQuestion = question => {
    let newIndicators = currentSurvey.surveyStoplightQuestions || [];
    let index = newIndicators.findIndex(q => q.codeName === question.codeName);
    newIndicators[index] = question;
    updateSurvey({ ...currentSurvey, surveyStoplightQuestions: newIndicators });
  };

  return (
    <div className={classes.surveyQuestionsContainer}>
      <Typography variant="h5">
        {t('views.surveyBuilder.stoplight.section')}
      </Typography>
      <div className={classes.tabsContainer}>
        <PreviewTabs
          surveyTopics={surveyDimensions}
          selectedSurveyTopic={selectedSurveyDimension}
          setSelectedSurveyTopic={setSelectedSurveyDimension}
        />
        <div>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={() => handleDeleteDimension()}
            disabled={
              !selectedSurveyDimension ||
              !Number.isInteger(selectedSurveyDimension.value)
            }
          >
            {t('views.surveyBuilder.stoplight.deleteDimension')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={() => toggleDimensionForm()}
            disabled={
              !selectedSurveyDimension ||
              !Number.isInteger(selectedSurveyDimension.value)
            }
          >
            {t('views.surveyBuilder.stoplight.editDimension')}
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
            {!!selectedSurveyDimension &&
              currentSurvey.surveyStoplightQuestions
                .filter(q => q.dimension === selectedSurveyDimension.text)
                .map((question, index) => (
                  <Draggable
                    key={question.codeName}
                    draggableId={question.codeName}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <React.Fragment key={index}>
                        {question.codeName === selectedQuestion ? (
                          <StoplightQuestionForm
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
                          <StoplightQuestion
                            itemRef={provided.innerRef}
                            draggableProps={{
                              ...provided.draggableProps,
                              ...provided.dragHandleProps
                            }}
                            order={index + 1}
                            question={question}
                            setSelectedQuestion={setSelectedQuestion}
                            handleDelete={() =>
                              deleteQuestion(question.codeName)
                            }
                            setSurveyQuestion={() =>
                              setSurveyQuestion(question)
                            }
                          />
                        )}
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
            {(!selectedSurveyDimension ||
              currentSurvey.surveyStoplightQuestions.filter(
                q => q.dimension === selectedSurveyDimension.text
              ).length === 0) && (
              <div className={classes.placeHolder}>
                <Typography variant="h6">
                  {t('views.surveyBuilder.stoplight.dropHere')}
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

export default connect(mapStateToProps, mapDispatchToProps)(StoplightPreview);
