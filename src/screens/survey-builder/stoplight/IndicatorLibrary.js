import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LeftArrow from '@material-ui/icons/ChevronLeftOutlined';
import RightArrow from '@material-ui/icons/ChevronRightOutlined';
import DragIcon from '@material-ui/icons/DragIndicator';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { indicatorsPool } from '../../../api';
import { theme } from '../../../theme';
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
    maxWidth: 400,
    wordBreak: 'break-word'
  },
  loadingContainer: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dimensionContainer: {
    minHeight: 60,
    height: 'fit-content',
    justifyContent: 'space-between',
    padding: '0 8px',
    borderBottom: '1px solid #BDBDBD'
  },
  icon: {
    fontSize: 20,
    color: '#BDBDBD'
  },
  indicatorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    minHeight: 57,
    borderRadius: 4,
    wordBreak: 'break-word'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  dimensionSubtitle: {
    color: '#BDBDBD',
    fontSize: 13,
    maxWidth: 400
  }
}));

const IndicatorLibrary = ({
  selectedSurveyDimension,
  setLibraryIndicator,
  language,
  user
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [dimensions, setDimensions] = useState([]);
  const [selectedDimension, setSelectedDimension] = useState('');

  useEffect(() => {
    setLoading(true);
    indicatorsPool(filter, language, user)
      .then(response => {
        let data = [];
        const rawData = response.data.data.indicatorsPool;
        rawData.forEach(q => {
          let dimensionQuestions = data[q.dimension] || [];
          dimensionQuestions.push(q);
          data[q.dimension] = dimensionQuestions;
        });
        setDimensions(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
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

      <div style={{ margin: '10px 15px' }}>
        <SearchText
          label={t('views.surveyBuilder.economic.search')}
          onKeyDown={e => onChangeFilterText(e)}
        />
      </div>

      <div className={classes.subtitleContainer}>
        {selectedDimension && (
          <IconButton
            style={{ marginLeft: 4 }}
            onClick={() => setSelectedDimension('')}
          >
            <LeftArrow style={{ cursor: 'pointer' }} className={classes.icon} />
          </IconButton>
        )}
        <Typography
          variant="h6"
          className={classes.title}
          style={{ color: theme.palette.text.primary }}
        >
          {selectedDimension
            ? selectedDimension
            : t('views.surveyBuilder.stoplight.dimensions')}
        </Typography>
      </div>

      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}

      {!selectedDimension &&
        Object.keys(dimensions).map((dimensionName, index) => {
          return (
            <div
              key={index}
              className={clsx(
                classes.subtitleContainer,
                classes.dimensionContainer
              )}
            >
              <Typography style={{ maxWidth: 400 }} variant="h6">
                {dimensionName}
              </Typography>
              <IconButton onClick={() => setSelectedDimension(dimensionName)}>
                <RightArrow
                  style={{ cursor: 'pointer' }}
                  className={classes.icon}
                />
              </IconButton>
            </div>
          );
        })}

      {!!selectedDimension && (
        <Droppable droppableId="indicatorLibrary">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {dimensions[selectedDimension].map((indicator, index) => (
                <Draggable
                  key={indicator.id}
                  draggableId={indicator.codeName + indicator.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      key={indicator.id}
                      className={classes.indicatorContainer}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onMouseEnter={() =>
                        setLibraryIndicator({
                          ...indicator,
                          dimension: selectedSurveyDimension.text
                        })
                      }
                    >
                      <div className={classes.textContainer}>
                        <Typography style={{ maxWidth: 400 }} variant="h6">
                          {indicator.questionText}
                        </Typography>
                        <Typography
                          className={classes.dimensionSubtitle}
                          variant="subtitle2"
                        >
                          {selectedDimension}
                        </Typography>
                      </div>

                      <DragIcon className={classes.icon} />
                    </div>
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

export default connect(mapStateToProps)(IndicatorLibrary);
