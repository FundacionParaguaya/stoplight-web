import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DragIcon from '@material-ui/icons/DragIndicator';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import React, { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { dimensionsPool } from '../../../api';
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
    maxWidth: 400
  },
  icon: {
    fontSize: 20,
    color: '#BDBDBD'
  },
  dimensionContainer: {
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto'
  }
}));

const DimensionLibrary = ({ setLibraryDimension, surveyLanguage, user }) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [dimensions, setDimensions] = useState([]);

  useEffect(() => {
    setLoading(true);
    dimensionsPool(surveyLanguage, language, user)
      .then(response => {
        const data = response.data.data.dimensionsByLang;
        setDimensions(data);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.titleContainer}>
        <Typography variant="h6" className={classes.title}>
          {t('views.surveyBuilder.economic.library')}
        </Typography>
        <Tooltip
          title={t('views.surveyBuilder.stoplight.dimensionLibraryInfo')}
        >
          <InfoIcon className={classes.icon} />
        </Tooltip>
      </div>

      <div style={{ margin: '10px 15px' }}>
        <SearchText
          label={t('views.surveyBuilder.stoplight.searchDimension')}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className={classes.subtitleContainer}>
        <Typography
          variant="h6"
          className={classes.title}
          style={{ color: theme.palette.text.primary }}
        >
          {t('views.surveyBuilder.stoplight.dimensions')}
        </Typography>
      </div>

      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}

      <Droppable droppableId="dimensionLibrary">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {dimensions
              .filter(o => !filter || o.name.indexOf(filter) >= 0)
              .map(({ surveyDimensionId, name }, index) => (
                <Draggable
                  key={surveyDimensionId}
                  draggableId={`${surveyDimensionId}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      key={index}
                      className={classes.dimensionContainer}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onMouseEnter={() =>
                        setLibraryDimension({ surveyDimensionId, name })
                      }
                    >
                      <Typography style={{ maxWidth: 400 }} variant="h6">
                        {name}
                      </Typography>
                      <DragIcon className={classes.icon} />
                    </div>
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

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(DimensionLibrary);
