import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Typography from '@material-ui/core/Typography';
import QuestionItem from '../../../components/QuestionItem';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: '#E5E5E5',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 400,
    padding: theme.spacing(1)
  },
  title: {
    color: 'black',
    margin: '2rem 16px 8px 8px',
    fontSize: 14,
    fontWeight: 700
  }
}));

const FieldTypes = ({ selectedSurveyTopic, setNewQuestion }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const generalProperties = {
    questionText: '',
    shortName: '',
    required: false,
    otherOption: false
  };
  const answerTypes = [
    { ...generalProperties, answerType: 'select', options: [] },
    { ...generalProperties, answerType: 'radio', options: [] },
    { ...generalProperties, answerType: 'checkbox', options: [] },
    { ...generalProperties, answerType: 'number' },
    { ...generalProperties, answerType: 'text' }
  ];

  return (
    <div className={classes.mainContainer}>
      <Typography variant="h6" className={classes.title}>
        {t('views.surveyBuilder.economic.fieldTypes')}
      </Typography>

      <Droppable droppableId="newQuestion">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {answerTypes.map((question, index) => (
              <Draggable
                key={index}
                draggableId={question.answerType}
                index={index}
              >
                {(provided, snapshot) => (
                  <QuestionItem
                    itemRef={provided.innerRef}
                    draggableProps={{
                      ...provided.draggableProps,
                      ...provided.dragHandleProps
                    }}
                    question={''}
                    answerType={question.answerType}
                    onClickProp={() =>
                      setNewQuestion({
                        ...question,
                        topic: selectedSurveyTopic.text
                      })
                    }
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default FieldTypes;
