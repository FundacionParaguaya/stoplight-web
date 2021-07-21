import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
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
import EconomicConditionals from './economic/EconomicConditionals';
import EconomicLibrary from './economic/EconomicLibrary';
import EconomicPreview from './economic/EconomicPreview';
import FieldTypes from './economic/FieldTypes';
import TopicForm from './economic/TopicForm';
import HelpView from './HelpView';
import ProgressBar from './ProgressBar';

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
  loadingContainer: {
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  }
}));

const Economics = ({ user, currentSurvey, updateSurvey }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [selectedSurveyTopic, setSelectedSurveyTopic] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [surveyTopics, setSurveyTopics] = useState([]);
  const [topicForm, setTopicForm] = useState('');
  // State to handle drags and drops from current survey
  const [surveyQuestion, setSurveyQuestion] = useState();
  // State to handle  drags and drops from economic library
  const [libraryQuestion, setLibraryQuestion] = useState();
  // State to handle drags and drops from new questions tab
  const [newQuestion, setNewQuestion] = useState();

  const onSave = () => {
    setLoading(true);
    history.push('/survey-builder/stoplights');
  };

  const updateQuestions = questions => {
    updateSurvey({
      ...currentSurvey,
      surveyEconomicQuestions: questions
    });
  };

  const insertQuestionAndUpdate = (questions, question, destinationIndex) => {
    const topicIndex = questions.findIndex(
      q => q.topic === surveyQuestion.topic
    );
    questions.splice(destinationIndex + topicIndex, 0, question);
    questions = questions.map((q, index) => ({ ...q, orderNumber: index + 1 }));
    updateQuestions(questions);
  };

  const onDragEnd = result => {
    const { source, destination } = result;

    // case for dicarded questions
    if (!destination) {
      if (source.droppableId === 'survey') {
        const newQuestions = Array.from(currentSurvey.surveyEconomicQuestions)
          .filter(q => q.codeName !== surveyQuestion.codeName)
          .map((q, index) => ({ ...q, orderNumber: index + 1 }));
        updateQuestions(newQuestions);
      }
      return;
    }

    // change a single question position
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'survey') {
        let newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
        const topicIndex = newQuestions.findIndex(
          q => q.topic === surveyQuestion.topic
        );
        const [question] = newQuestions.splice(source.index + topicIndex, 1);
        insertQuestionAndUpdate(newQuestions, question, destination.index);
      }
    } else {
      // Case: add a new a question from the library
      if (
        source.droppableId === 'library' &&
        destination.droppableId === 'survey' &&
        !!libraryQuestion &&
        !!selectedSurveyTopic &&
        !!Number.isInteger(selectedSurveyTopic.value)
      ) {
        let newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
        const question = {
          ...libraryQuestion,
          codeName: libraryQuestion.codeName + '_' + newQuestions.length
        };
        insertQuestionAndUpdate(newQuestions, question, destination.index);
      }

      // Case: add a new a question from scratch
      if (
        source.droppableId === 'newQuestion' &&
        destination.droppableId === 'survey' &&
        !!newQuestion &&
        !!selectedSurveyTopic &&
        !!Number.isInteger(selectedSurveyTopic.value)
      ) {
        const newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
        const codeName = `addedQuestion_${newQuestions.length}`;
        const question = { ...newQuestion, codeName: codeName };
        insertQuestionAndUpdate(newQuestions, question, destination.index);
        setSelectedQuestion(codeName);
      }
    }
  };

  const updateTopics = topic => {
    let newTopics = Array.from(surveyTopics);
    const index = newTopics.findIndex(t => t.value === topic.value);
    if (index >= 0) {
      let newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
      const oldTopic = newTopics[index];
      newQuestions = newQuestions.map(question => {
        if (question.topic === oldTopic.text) {
          return { ...question, topic: topic.text, topicAudio: topic.audioUrl };
        } else {
          return question;
        }
      });
      updateQuestions(newQuestions);
      newTopics[index] = topic;
      setSelectedSurveyTopic({ value: index, ...topic });
    } else {
      const value = newTopics.length;
      newTopics.push({ value: value, ...topic });
      setSelectedSurveyTopic({ value: value, ...topic });
    }
    setSurveyTopics(newTopics);
  };

  const handleDeleteTopic = topic => {
    let newTopics = Array.from(surveyTopics).filter(
      t => t.value !== topic.value
    );
    let newQuestions = Array.from(currentSurvey.surveyEconomicQuestions).filter(
      q => q.topic !== topic.text
    );
    updateQuestions(newQuestions);
    setSelectedSurveyTopic(newTopics[0] || {});
    setSurveyTopics(newTopics);
  };

  return (
    <React.Fragment>
      <ProgressBar />
      <div className={classes.mainContainer}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          indicatorColor="primary"
          textColor="primary"
          value={tab}
          onChange={(event, value) => {
            setTopicForm(false);
            setTab(value);
          }}
          classes={{ root: classes.tabsRoot }}
        >
          <Tab
            key={0}
            classes={{ root: classes.tabRoot }}
            label={
              <Tooltip title={t('views.surveyBuilder.economic.library')}>
                <FolderOpen />
              </Tooltip>
            }
            value={1}
          />
          <Tab
            key={1}
            classes={{ root: classes.tabRoot }}
            label={
              <Tooltip title={t('views.surveyBuilder.economic.newQuestion')}>
                <FormatShapes />
              </Tooltip>
            }
            value={2}
          />
          <Tab
            key={2}
            classes={{ root: classes.tabRoot }}
            label={
              <Tooltip title={t('views.surveyBuilder.economic.conditional')}>
                <DeviceHub />
              </Tooltip>
            }
            value={3}
          />
          <Tab
            key={3}
            classes={{ root: classes.tabRoot }}
            label={
              <Tooltip title={t('views.surveyBuilder.help')}>
                <HelpOutline />
              </Tooltip>
            }
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
              onSave={onSave}
            />
          )}
          {topicForm && (
            <TopicForm
              topic={selectedSurveyTopic}
              toggle={() => {
                !selectedSurveyTopic.value &&
                  Array.isArray(surveyTopics) &&
                  setSelectedSurveyTopic(surveyTopics[0]);
                setTopicForm(!topicForm);
              }}
              updateTopics={updateTopics}
            />
          )}
          {tab === 3 && (
            <EconomicConditionals
              selectedSurveyTopic={selectedSurveyTopic}
              setSelectedSurveyTopic={setSelectedSurveyTopic}
              surveyTopics={surveyTopics}
              onSave={onSave}
            />
          )}
          {tab === 4 && <HelpView />}
        </DragDropContext>

        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        )}
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
)(withLayout(Economics));
