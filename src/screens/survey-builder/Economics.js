import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {
  DeviceHub,
  FolderOpen,
  FormatShapes,
  HelpOutline
} from '@material-ui/icons/';
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import withLayout from '../../components/withLayout';
import { updateSurvey } from '../../redux/actions';
import { COLORS } from '../../theme';
import EconomicPreview from './economic/EconomicPreview';
import FieldTypes from './economic/FieldTypes';
import EconomicLibrary from './economic/EconomicLibrary';
import TopicForm from './economic/TopicForm';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%'
  },
  tabsRoot: {
    width: 60,
    backgroundColor: theme.palette.background.default,
    '& $div > span': {
      backgroundColor: theme.palette.background.default
    }
  },
  tabRoot: {
    minWidth: 'auto',
    color: COLORS.LIGHT_GREY,
    height: 'auto',
    width: '100%'
  },
  buttonContainer: {
    marginTop: '2rem',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
}));

const Economics = ({ user, currentSurvey, updateSurvey }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [libraryQuestion, setLibraryQuestion] = useState();
  const [surveyQuestion, setSurveyQuestion] = useState();
  const [newQuestion, setNewQuestion] = useState();
  const [selectedSurveyTopic, setSelectedSurveyTopic] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [surveyTopics, setSurveyTopics] = useState([]);
  const [topicForm, setTopicForm] = useState('');

  const getDimensions = () => {
    const stoplightQuestions = Array.from(
      currentSurvey.surveyStoplightQuestions
    );
    const dimensions = [];
    stoplightQuestions.forEach(q => {
      if (dimensions.includes(q.dimension)) return;
      dimensions.push(q.dimension);
    });
    return dimensions;
  };

  const onSave = () => {
    setLoading(true);
    const surveyDimensions = getDimensions();
    updateSurvey({
      ...currentSurvey,
      topics: surveyTopics,
      dimensions: surveyDimensions
    });
    setLoading(false);
    history.push('/survey-builder/summary');
  };

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      if (source.droppableId === 'survey') {
        const newQuestions = Array.from(
          currentSurvey.surveyEconomicQuestions
        ).filter(q => q.codeName !== surveyQuestion.codeName);

        updateSurvey({
          ...currentSurvey,
          surveyEconomicQuestions: newQuestions
        });
      }
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'survey') {
        const newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
        const topicIndex = newQuestions.findIndex(
          q => q.topic === surveyQuestion.topic
        );
        const [removed] = newQuestions.splice(source.index + topicIndex, 1);
        newQuestions.splice(destination.index + topicIndex, 0, removed);
        updateSurvey({
          ...currentSurvey,
          surveyEconomicQuestions: newQuestions
        });
      }
    } else {
      if (
        source.droppableId === 'library' &&
        destination.droppableId === 'survey' &&
        !!libraryQuestion
      ) {
        let newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
        const topicStart = newQuestions.findIndex(
          q => q.topic === libraryQuestion.topic
        );
        const topicLength = newQuestions.filter(
          q => q.topic === libraryQuestion.topic
        ).length;
        newQuestions.splice(topicStart + topicLength, 0, {
          ...libraryQuestion,
          codeName: libraryQuestion.codeName + '_' + newQuestions.length
        });
        updateSurvey({
          ...currentSurvey,
          surveyEconomicQuestions: newQuestions
        });
      }
      if (
        source.droppableId === 'newQuestion' &&
        destination.droppableId === 'survey' &&
        !!newQuestion
      ) {
        const newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
        const codeName = `addedQuestion_${newQuestions.length}`;
        setSelectedQuestion(codeName);
        newQuestions.push({ ...newQuestion, codeName: codeName });
        updateSurvey({
          ...currentSurvey,
          surveyEconomicQuestions: newQuestions
        });
      }
    }
  };

  const updateTopics = topic => {
    let newTopics = Array.from(surveyTopics);
    const index = newTopics.findIndex(t => t.value === topic.value);
    if (index > 0) {
      let newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
      const oldTopic = newTopics[index];
      newQuestions = newQuestions.map(question => {
        if (question.topic === oldTopic.text) {
          return { ...question, topic: topic.text };
        } else {
          return question;
        }
      });
      updateSurvey({
        ...currentSurvey,
        surveyEconomicQuestions: newQuestions
      });
      newTopics[index] = topic;
    } else {
      newTopics.push({ value: newTopics.length, ...topic });
    }
    setSelectedSurveyTopic({ value: newTopics.length - 1, ...topic });
    setSurveyTopics(newTopics);
  };

  const handleDeleteTopic = topic => {
    let newTopics = Array.from(surveyTopics).filter(
      t => t.value !== topic.value
    );
    let newQuestions = Array.from(currentSurvey.surveyEconomicQuestions).filter(
      q => q.topic !== topic.text
    );
    updateSurvey({
      ...currentSurvey,
      surveyEconomicQuestions: newQuestions
    });
    setSelectedSurveyTopic(newTopics[0] || {});
    setSurveyTopics(newTopics);
  };

  return (
    <div className={classes.mainContainer}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        indicatorColor="primary"
        textColor="primary"
        value={tab}
        onChange={(event, value) => setTab(value)}
        classes={{ root: classes.tabsRoot }}
      >
        <Tab
          key={0}
          classes={{ root: classes.tabRoot }}
          label={<FolderOpen />}
          value={1}
        />
        <Tab
          key={1}
          classes={{ root: classes.tabRoot }}
          label={<FormatShapes />}
          value={2}
        />
        <Tab
          key={2}
          classes={{ root: classes.tabRoot }}
          label={<DeviceHub />}
          value={3}
        />
        <Tab
          key={3}
          classes={{ root: classes.tabRoot }}
          label={<HelpOutline />}
          value={4}
        />
      </Tabs>
      <DragDropContext onDragEnd={onDragEnd}>
        {tab === 1 && (
          <EconomicLibrary
            selectedSurveyTopic={selectedSurveyTopic}
            setLibraryQuestion={setLibraryQuestion}
            toggleTopicForm={() => {
              setSelectedSurveyTopic({});
              setTopicForm(!topicForm);
            }}
            language={currentSurvey.language}
          />
        )}
        {tab === 2 && (
          <FieldTypes
            selectedSurveyTopic={selectedSurveyTopic}
            setNewQuestion={setNewQuestion}
          />
        )}
        {(tab === 1 || tab === 2) && !topicForm && (
          <EconomicPreview
            selectedSurveyTopic={selectedSurveyTopic}
            setSelectedSurveyTopic={setSelectedSurveyTopic}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            setSurveyQuestion={setSurveyQuestion}
            goToConditional={() => setTab(3)}
            surveyTopics={surveyTopics}
            setSurveyTopics={setSurveyTopics}
            toggleTopicForm={() => setTopicForm(!topicForm)}
            handleDeleteTopic={handleDeleteTopic}
          />
        )}
        {topicForm && (
          <TopicForm
            topic={selectedSurveyTopic}
            toggle={() => setTopicForm(!topicForm)}
            updateTopics={updateTopics}
          />
        )}
      </DragDropContext>
      // TODO cambiar condicional
      {true && (
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
      )}
    </div>
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
)(withLayout(Economics));
