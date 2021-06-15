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
import withLayout from '../../components/withLayout';
import { updateSurvey } from '../../redux/actions';
import { COLORS } from '../../theme';
import EconomicPreview from './economic/EconomicPreview';
import FieldTypes from './economic/FieldTypes';
import EconomicLibrary from './economic/EconomicLibrary';

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

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [libraryQuestion, setLibraryQuestion] = useState();
  const [surveyQuestion, setSurveyQuestion] = useState();
  const [newQuestion, setNewQuestion] = useState();
  const [selectedSurveyTopic, setSelectedSurveyTopic] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const onSave = () => {
    setLoading(true);
    updateSurvey({ ...currentSurvey });
    setLoading(false);
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
        destination.droppableId === 'survey'
      ) {
        const newQuestions = Array.from(currentSurvey.surveyEconomicQuestions);
        newQuestions.push(libraryQuestion);
        updateSurvey({
          ...currentSurvey,
          surveyEconomicQuestions: newQuestions
        });
      }
      if (
        source.droppableId === 'newQuestion' &&
        destination.droppableId === 'survey'
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
          />
        )}
        {tab === 2 && (
          <FieldTypes
            selectedSurveyTopic={selectedSurveyTopic}
            setNewQuestion={setNewQuestion}
          />
        )}
        {(tab === 1 || tab === 2) && (
          <EconomicPreview
            selectedSurveyTopic={selectedSurveyTopic}
            setSelectedSurveyTopic={setSelectedSurveyTopic}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            setSurveyQuestion={setSurveyQuestion}
          />
        )}
      </DragDropContext>

      {false && (
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
