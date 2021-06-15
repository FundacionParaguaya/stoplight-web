import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddBox from '@material-ui/icons/AddBoxRounded';
import LeftArrow from '@material-ui/icons/ChevronLeftOutlined';
import RightArrow from '@material-ui/icons/ChevronRightOutlined';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { economicQuestionsPool } from '../../../api';
import QuestionItem from '../../../components/QuestionItem';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: '#E5E5E5',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: 275
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
    fontWeight: 700
  },
  icon: {
    fontSize: 20,
    color: '#BDBDBD'
  },
  addIcon: {
    color: theme.palette.primary.dark,
    fontSize: 26,
    position: 'absolute',
    right: 13
  },
  topicContainer: {
    minHeight: 60,
    height: 'fit-content',
    justifyContent: 'space-between',
    padding: '0 8px',
    borderBottom: '1px solid #BDBDBD'
  },
  filterInput: {
    padding: '14.0px!important',
    fontFamily: 'Poppins',
    fontSize: '12px'
  },
  inputRootLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    color: theme.palette.grey.middle,
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 13,
    zIndex: 0
  },
  inputLabel: {
    transform: 'translate(14px, -6px) scale(0.75)!important',
    width: 'fit-content'
  },
  textField: {
    backgroundColor: theme.palette.background.default,
    margin: '10px 15px!important',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 2,
        border: `1.5px solid ${theme.palette.grey.quarter}`
      },
      '&:hover fieldset': {
        borderColor: 'hsl(0, 0%, 70%)'
      },
      '&.Mui-focused fieldset': {
        border: `1.5px solid ${theme.palette.primary.dark}`
      }
    }
  }
}));

const EconomicLibrary = ({ selectedSurveyTopic, setLibraryQuestion, user }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [topics, setTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('');

  const loadQuestions = (filter, language, user) => {
    setLoading(true);
    economicQuestionsPool(filter, language, user)
      .then(response => {
        let data = [];
        let rawData = response.data.data.economicQuestionsPool.content;
        rawData.forEach(question => {
          let topicQuestions = data[question.topic] || [];
          topicQuestions.push(question);
          data[question.topic] = topicQuestions;
        });
        setTopics(data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
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
        <InfoIcon className={classes.icon} />
      </div>

      <TextField
        InputProps={{
          classes: {
            input: classes.filterInput
          }
        }}
        InputLabelProps={{
          classes: {
            root: classes.inputRootLabel,
            shrink: classes.inputLabel
          }
        }}
        variant="outlined"
        margin="dense"
        className={classes.textField}
        onKeyDown={e => onChangeFilterText(e)}
        label={
          <React.Fragment>
            <Typography>{t('views.surveyBuilder.economic.search')}</Typography>
            <SearchIcon className={classes.icon} />
          </React.Fragment>
        }
      />

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

        <AddBox className={classes.addIcon} />
      </div>

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
              <Typography variant="h6">{topicName}</Typography>
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
              {topics[selectedTopic].map((question, index) => (
                <Draggable
                  key={question.codeName}
                  draggableId={question.codeName}
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
                          topic: selectedSurveyTopic
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
