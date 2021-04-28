import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import interventionBanner from '../assets/reports_banner.png';
import Container from '../components/Container';
import QuestionItem from '../components/QuestionItem';
import withLayout from '../components/withLayout';
import { COLORS } from '../theme';
import { move, reorder } from '../utils/array-utils';
import InterventionQuestion from './interventions/InterventionQuestion';
import { listInterventionsQuestions } from '../api';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.default
  },
  dragContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2)
  },
  loadingContainer: {
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: 175
  },
  mapsTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 180
  },
  interventionImage: {
    display: 'block',
    height: 175,
    right: 0,
    position: 'absolute',
    top: -10,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  itemList: {
    backgroundColor: COLORS.LIGHT_GREY,
    border: '2px',
    width: '30vw'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '30px 0'
  }
}));

const Interventions = ({ user, history }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const [coreQuestions, setCoreQuestions] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const getList = id => (id === 'droppable' ? items : selectedItems);

  useEffect(() => {
    listInterventionsQuestions(user, language)
      .then(response => {
        let questions = response.data.data.interventionPresetQuestions;
        let mainQuestions = questions.filter(q => q.coreQuestion);
        let itemQuestions = questions.filter(q => !q.coreQuestion);
        itemQuestions = itemQuestions.map(question => {
          return {
            ...question,
            options: [{ value: 'value', text: '' }]
          };
        });
        setCoreQuestions(mainQuestions);
        setItems(itemQuestions);
      })
      .catch(e => console.log(e));
  }, []);

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === 'droppable2') {
        setSelectedItems(items);
      } else {
        setItems(items);
      }
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setItems(result.droppable);
      setSelectedItems(result.droppable2);
    }
  };

  const updateQuestion = (index, question) => {
    let newSelectedItems = Array.from(selectedItems);
    newSelectedItems[index] = question;
    setSelectedItems(newSelectedItems);
  };

  const onSave = () => {
    let questions = Array.from(selectedItems);
    questions = questions.map(q => {
      let question = JSON.parse(JSON.stringify(q));
      if (question.otherOption) {
        question.options.push({ value: '', text: 'Other', otherOption: true });
        delete question.otherOption;
      }
      return question;
    });
    const hasErrors = questions.some(
      question =>
        true &&
        (question.answerType === 'select' ||
          question.answerType === 'radio' ||
          question.answerType === 'checkbox') &&
        (question.options.length === 0 ||
          !question.options.some(option => option.text))
    );

    console.log(hasErrors);
  };

  return (
    <Container variant="stretch" className={classes.mainContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.mapsTitle}>
          <Typography variant="h4">
            {t('views.intervention.definition.title')}
          </Typography>
          <Typography variant="h6" style={{ color: 'grey' }}>
            {t('views.intervention.definition.subtitle')}
          </Typography>
        </div>
        <img
          src={interventionBanner}
          alt="Intervention Banner"
          className={classes.interventionImage}
        />
      </div>

      <Typography variant="h5">
        {t('views.intervention.definition.coreQuestions')}
      </Typography>

      {coreQuestions.map(question => (
        <QuestionItem
          key={question.codeName}
          question={question.shortName}
          answerType={question.answerType}
        />
      ))}

      <Typography variant="h5" style={{ marginTop: 16 }}>
        {t('views.intervention.definition.questionsTitle')}
      </Typography>
      <div className={classes.dragContainer}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classes.itemList}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.codeName}
                    draggableId={item.codeName}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <QuestionItem
                        itemRef={provided.innerRef}
                        draggableProps={{
                          ...provided.draggableProps,
                          ...provided.dragHandleProps
                        }}
                        question={item.shortName}
                        answerType={item.answerType}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="droppable2">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={classes.itemList}
              >
                {selectedItems.map((selectedItem, index) => (
                  <Draggable
                    key={selectedItem.codeName}
                    draggableId={selectedItem.codeName}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <InterventionQuestion
                        itemRef={provided.innerRef}
                        draggableProps={{
                          ...provided.draggableProps,
                          ...provided.dragHandleProps
                        }}
                        question={selectedItem}
                        updateQuestion={question =>
                          updateQuestion(index, question)
                        }
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className={classes.buttonContainerForm}>
        <Button variant="outlined" color="primary" onClick={() => {}}>
          {t('general.cancel')}
        </Button>

        <Button color="primary" variant="contained" onClick={() => onSave()}>
          {t('general.save')}
        </Button>
      </div>
    </Container>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(connect(mapStateToProps)(withLayout(Interventions)));
