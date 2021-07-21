import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import { FolderOpen, HelpOutline } from '@material-ui/icons/';
import DimensionsIcon from '@material-ui/icons/MenuBook';
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import withLayout from '../../components/withLayout';
import { updateSurvey } from '../../redux/actions';
import { COLORS } from '../../theme';
import HelpView from './HelpView';
import ProgressBar from './ProgressBar';
import DimensionLibrary from './stoplight/DimensionLibrary';
import IndicatorLibrary from './stoplight/IndicatorLibrary';
import StoplightDimensionForm from './stoplight/StoplightDimensionForm';
import StoplightPreview from './stoplight/StoplightPreview';

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

const Stoplights = ({ user, currentSurvey, updateSurvey }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [surveyDimensions, setSurveyDimensions] = useState([]);
  const [selectedSurveyDimension, setSelectedSurveyDimension] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [dimensionForm, setDimensionForm] = useState(false);
  // State to handle drags and drops from current survey
  const [surveyQuestion, setSurveyQuestion] = useState();
  // State to handle  drags and drops from dimensions library
  const [libraryDimension, setLibraryDimension] = useState();
  // State to handle  drags and drops from indicator library
  const [libraryIndicator, setLibraryIndicator] = useState();

  const onSave = () => {
    setLoading(true);
    history.push('/survey-builder/summary');
  };

  const updateIndicators = indicators => {
    updateSurvey({
      ...currentSurvey,
      surveyStoplightQuestions: indicators
    });
  };

  const onDragEnd = result => {
    const { source, destination } = result;

    // case for an indicator discarded
    if (!destination) {
      if (source.droppableId === 'survey') {
        const newIndicators = Array.from(currentSurvey.surveyStoplightQuestions)
          .filter(q => q.codeName !== surveyQuestion.codeName)
          .map((q, index) => ({ ...q, order: index + 1 }));
        updateIndicators(newIndicators);
      }
      return;
    }
    // change a single indicator position
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'survey') {
        let newIndicators = Array.from(currentSurvey.surveyStoplightQuestions);
        const dimensionIndex = newIndicators.findIndex(
          q => q.dimension === selectedQuestion.dimension
        );
        const [removed] = newIndicators.splice(
          source.index + dimensionIndex,
          1
        );
        newIndicators.splice(destination.index + dimensionIndex, 0, removed);
        newIndicators = newIndicators.map((q, index) => ({
          ...q,
          order: index + 1
        }));
        updateIndicators(newIndicators);
      }
    } else {
      // Add a new dimension from dimension library
      if (
        source.droppableId === 'dimensionLibrary' &&
        destination.droppableId === 'survey' &&
        !!libraryDimension
      ) {
        let newDimensions = Array.from(surveyDimensions).filter(
          d => d.surveyDimensionId !== libraryDimension.surveyDimensionId
        );
        const addedDimension = {
          value: newDimensions.length,
          text: libraryDimension.name,
          ...libraryDimension
        };
        newDimensions.push(addedDimension);
        setSurveyDimensions(newDimensions);
        setSelectedSurveyDimension(addedDimension);
      }
      // Add a new indicator from indicator library
      if (
        source.droppableId === 'indicatorLibrary' &&
        destination.droppableId === 'survey' &&
        !!libraryIndicator &&
        !!selectedSurveyDimension
      ) {
        let newIndicators = Array.from(currentSurvey.surveyStoplightQuestions);
        const dimensionIndex = newIndicators.findIndex(
          q => q.dimension === libraryIndicator.dimension
        );
        //Assign unique codename in case it's a new indicator
        const codeName = libraryIndicator.newOne
          ? libraryIndicator.codeName + newIndicators.length
          : libraryIndicator.codeName;
        newIndicators.splice(destination.index + dimensionIndex, 0, {
          ...libraryIndicator,
          codeName: codeName,
          surveyStoplightDimension: selectedSurveyDimension
        });
        newIndicators = newIndicators.map((q, index) => ({
          ...q,
          order: index + 1
        }));
        updateIndicators(newIndicators);
        libraryIndicator.newOne && setSelectedQuestion(codeName);
      }
    }
  };

  const updateDimensions = dimension => {
    let newDimensions = Array.from(surveyDimensions);
    const index = newDimensions.findIndex(t => t.value === dimension.value);
    if (index >= 0) {
      let newIndicators = Array.from(currentSurvey.surveyStoplightQuestions);
      const oldDimension = newDimensions[index];
      newIndicators = newIndicators.map(question => {
        if (question.dimension === oldDimension.text) {
          return { ...question, dimension: dimension.text };
        } else {
          return question;
        }
      });
      newDimensions[index] = dimension;
      updateIndicators(newIndicators);
      setSelectedSurveyDimension({ value: index, ...dimension });
    } else {
      const value = newDimensions.length;
      newDimensions.push({ value: value, ...dimension });
      setSelectedSurveyDimension({ value: value, ...dimension });
    }
    setSurveyDimensions(newDimensions);
  };

  const handleDeleteDimension = dimension => {
    let newDimensions = Array.from(surveyDimensions).filter(
      d => d.value !== dimension.value
    );
    let newIndicators = Array.from(
      currentSurvey.surveyStoplightQuestions
    ).filter(q => q.dimension !== dimension.text);
    updateIndicators(newIndicators);
    setSelectedSurveyDimension(newDimensions[0] || {});
    setSurveyDimensions(newDimensions);
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
            setDimensionForm(false);
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
              <Tooltip
                title={t('views.surveyBuilder.stoplight.dimensionLibrary')}
              >
                <DimensionsIcon />
              </Tooltip>
            }
            value={2}
          />
          <Tab
            key={2}
            classes={{ root: classes.tabRoot }}
            label={
              <Tooltip title={t('views.surveyBuilder.help')}>
                <HelpOutline />
              </Tooltip>
            }
            value={3}
          />
        </Tabs>

        <DragDropContext onDragEnd={onDragEnd}>
          {tab === 1 && (
            <IndicatorLibrary
              selectedSurveyDimension={selectedSurveyDimension}
              setLibraryIndicator={setLibraryIndicator}
              surveyLanguage={currentSurvey.language}
            />
          )}
          {tab === 2 && (
            <DimensionLibrary
              setLibraryDimension={setLibraryDimension}
              surveyLanguage={currentSurvey.language.substring(0, 2)}
            />
          )}
          {(tab === 1 || tab === 2) && !dimensionForm && (
            <StoplightPreview
              surveyDimensions={surveyDimensions}
              setSurveyDimensions={setSurveyDimensions}
              selectedSurveyDimension={selectedSurveyDimension}
              setSelectedSurveyDimension={setSelectedSurveyDimension}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={setSelectedQuestion}
              setSurveyQuestion={setSurveyQuestion}
              toggleDimensionForm={() => setDimensionForm(!dimensionForm)}
              handleDeleteDimension={() =>
                handleDeleteDimension(selectedSurveyDimension)
              }
              onSave={onSave}
            />
          )}
          {tab === 3 && <HelpView />}
        </DragDropContext>

        {dimensionForm && (
          <StoplightDimensionForm
            dimension={selectedSurveyDimension}
            toggle={() => {
              !selectedSurveyDimension.value &&
                Array.isArray(surveyDimensions) &&
                setSelectedSurveyDimension(surveyDimensions[0]);
              setDimensionForm(!dimensionForm);
            }}
            updateDimensions={updateDimensions}
          />
        )}

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
)(withLayout(Stoplights));
