import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/AddBoxRounded';
import LeftArrow from '@material-ui/icons/ChevronLeftOutlined';
import RightArrow from '@material-ui/icons/ChevronRightOutlined';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { economicQuestionsPool } from '../../../api';
import QuestionItem from '../../../components/QuestionItem';
import SearchText from '../SearchText';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: '#E5E5E5',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 400
  },
  titleContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: theme.palette.background.default,
    height: 'fit-content',
    alignItems: 'center'
  },
  subtitleContainer: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: 'fit-content',
    alignItems: 'center'
  },
  title: {
    color: theme.palette.primary.dark,
    margin: '8px 16px 8px 8px',
    fontSize: 14,
    fontWeight: 700,
    maxWidth: 200,
    wordBreak: 'break-word'
  },
  icon: {
    fontSize: 20,
    color: '#BDBDBD'
  },
  addIconContainer: {
    position: 'absolute',
    right: 13
  },
  addIcon: {
    color: theme.palette.primary.dark,
    fontSize: 26
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  topicContainer: {
    minHeight: 60,
    height: 'fit-content',
    justifyContent: 'space-between',
    padding: '0 8px',
    borderBottom: '1px solid #BDBDBD'
  }
}));

const EconomicLibrary = ({
  selectedSurveyTopic,
  setLibraryQuestion,
  toggleTopicForm,
  language,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [topics, setTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('');

  const loadQuestions = (filter, language, user) => {
    setLoading(true);
    economicQuestionsPool(filter, language, user)
      .then(response => {
        let data = [];
        let rawData = response.data.data.economicQuestionsPool;
        rawData.forEach(question => {
          let topicQuestions = data[question.topic] || [];
          topicQuestions.push(question);
          data[question.topic] = topicQuestions;
        });
        setTopics(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadQuestions(filter, language, user);
  }, []);

  useEffect(() => {
    !loading && loadQuestions(filter, language, user);
  }, [filter]);

  const onChangeFilterText = e => {
    if (e.key === 'Enter') {
      setFilter(e.target.value);
    }
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.titleContainer}>
        <Typography variant="h6" className={classes.title}>
          {t('views.surveyBuilder.economic.library')}
        </Typography>
        <Tooltip title={t('views.surveyBuilder.economic.info')}>
          <InfoIcon className={classes.icon} />
        </Tooltip>
      </div>

      <div style={{ margin: '10px 15px' }}>
        <SearchText
          label={t('views.surveyBuilder.economic.search')}
          onKeyDown={e => onChangeFilterText(e)}
        />
      </div>

      <div className={classes.subtitleContainer}>
        {selectedTopic && (
          <IconButton
            style={{ marginLeft: 4 }}
            onClick={() => setSelectedTopic('')}
          >
            <LeftArrow style={{ cursor: 'pointer' }} className={classes.icon} />
          </IconButton>
        )}
        <Typography
          variant="h6"
          className={classes.title}
          style={{ color: 'black' }}
        >
          {selectedTopic
            ? selectedTopic
            : t('views.surveyBuilder.economic.topics')}
        </Typography>

        <IconButton
          onClick={() => toggleTopicForm()}
          className={classes.addIconContainer}
        >
          <AddBox className={classes.addIcon} />
        </IconButton>
      </div>

      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}

      {!selectedTopic &&
        Object.keys(topics).map((topicName, index) => {
          return (
            <div
              key={index}
              className={clsx(
                classes.subtitleContainer,
                classes.topicContainer
              )}
            >
              <Typography style={{ maxWidth: 400 }} variant="h6">
                {topicName}
              </Typography>
              <IconButton onClick={() => setSelectedTopic(topicName)}>
                <RightArrow
                  style={{ cursor: 'pointer' }}
                  className={classes.icon}
                />
              </IconButton>
            </div>
          );
        })}

      {!!selectedTopic && (
        <Droppable droppableId="library">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={classes.itemList}
            >
              {(topics[selectedTopic] || []).map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={
                    question.codeName + question.answerType + question.id
                  }
                  index={index}
                >
                  {(provided, snapshot) => (
                    <QuestionItem
                      itemRef={provided.innerRef}
                      draggableProps={{
                        ...provided.draggableProps,
                        ...provided.dragHandleProps
                      }}
                      question={question.shortName}
                      answerType={question.answerType}
                      onClickProp={() =>
                        setLibraryQuestion({
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
      )}
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(EconomicLibrary);
