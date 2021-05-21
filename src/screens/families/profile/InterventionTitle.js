import { IconButton, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LabelIcon from '@material-ui/icons/Label';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import TimelineIcon from '@material-ui/icons/Timeline';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import connectorSvg from '../../../assets/Connector.svg';
import { COLORS } from '../../../theme';
import { getMonthFormatByLocale } from '../../../utils/date-utils';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    position: 'relative',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  container: {
    position: 'relative',
    display: 'flex'
  },
  intervetionNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  interventionTypeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  connector: {
    position: 'absolute',
    top: -50,
    left: 15
  },
  containerRigth: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between'
    }
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 16
  },
  label: {
    marginRight: 5,
    marginLeft: 5,
    fontSize: 18,
    color: theme.palette.grey.middle
  },
  icon: {
    color: theme.typography.h4.color
  },
  yearContainer: {
    height: '100%',
    background: theme.palette.background.paper,
    borderLeft: `1px solid ${theme.palette.grey.quarter}`,
    boxSizing: 'border-box',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center'
  },
  dateContainer: {
    height: 36,
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.default,
    border: `1px solid ${theme.palette.grey.quarter}`,
    boxSizing: 'border-box',
    borderRadius: '2px'
  },

  tag: {
    fontWeight: 550,
    backgroundColor: theme.typography.h4.color,
    color: 'white',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    width: 'fit-content',
    height: 'fit-content'
  },
  iconStoplight: {
    display: 'inline-block',
    border: `2px solid ${theme.palette.background.default}`,
    borderRadius: '50%',
    minWidth: 20,
    minHeight: 20,
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginRight: 4
    }
  },
  interventionType: {
    color: theme.palette.grey.middle,
    fontFamily: 'Poppins',
    borderRadius: 6,
    padding: '6px 10px 6px 10px',
    marginRight: 4,
    width: 'fit-content',
    height: 'fit-content',
    overflowWrap: 'break-word',
    alignItems: 'center',
    backgroundColor: theme.palette.grey.quarter,
    display: 'flex'
  },
  labelIcon: {
    marginRight: 3,
    width: 19
  }
}));

const InterventionTitle = ({
  intervention,
  indicators,
  expand,
  setSelectedIntervention,
  setSelectedThread,
  handleAddRelated,
  related
}) => {
  const classes = useStyles();
  const { t, i18n: language } = useTranslation();
  const dateFormat = getMonthFormatByLocale(language);

  const [indicatorsTags, setIndicatorsTags] = useState([]);

  useEffect(() => {
    if (
      Array.isArray(indicators) &&
      Array.isArray(intervention.stoplightIndicator)
    ) {
      let tags = intervention.stoplightIndicator.map(key => {
        let tag = indicators.find(i => i.key === key || i.codeName === key);
        return !!tag ? tag : {};
      });
      setIndicatorsTags(tags);
    }
  }, [indicators, intervention]);

  return (
    <div className={classes.mainContainer}>
      {related && (
        <img alt="connect" src={connectorSvg} className={classes.connector} />
      )}
      <div className={classes.intervetionNameContainer}>
        <Typography
          className={classes.label}
          variant="subtitle1"
          style={{ marginLeft: 0 }}
        >
          {intervention.interventionName}
        </Typography>

        <div className={classes.tagContainer}>
          {intervention.generalIntervention && (
            <Typography variant="caption" className={classes.tag}>
              {t('views.familyProfile.interventions.form.generalOption')}
            </Typography>
          )}

          {indicatorsTags.map(item => (
            <div
              key={item.snapshotStoplightId || item.codeName}
              className={classes.container}
            >
              <div
                className={classes.iconStoplight}
                style={{
                  backgroundColor: item.value === 2 ? COLORS.YELLOW : COLORS.RED
                }}
              >
                {' '}
              </div>
              <Typography variant="subtitle1" style={{ marginRight: 16 }}>
                {item.shortName}
              </Typography>
            </div>
          ))}
        </div>

        {Array.isArray(intervention.relatedInterventions) &&
          intervention.relatedInterventions.length > 0 && (
            <Tooltip
              title={t(
                'views.familyProfile.interventions.relatedInterventions'
              )}
            >
              <IconButton
                style={{ width: 'fit-content' }}
                component="span"
                onClick={() => setSelectedThread(intervention.id)}
              >
                <TimelineIcon />
              </IconButton>
            </Tooltip>
          )}
      </div>

      <div className={classes.interventionTypeContainer}>
        <div className={classes.containerRigth}>
          <Typography variant="caption" className={classes.interventionType}>
            <LabelIcon className={classes.labelIcon} />
            {intervention.interventionType}
          </Typography>

          <div className={classes.dateContainer}>
            <Typography
              variant="subtitle1"
              className={classes.label}
              style={{ padding: '0.3rem' }}
            >
              {intervention.interventionDate
                ? `${moment
                    .unix(intervention.interventionDate)
                    .format(dateFormat)}`
                : ''}
            </Typography>

            <div className={classes.yearContainer}>
              <Typography variant="subtitle1" className={classes.label}>
                {intervention.interventionDate
                  ? `${moment
                      .unix(intervention.interventionDate)
                      .format('YYYY')}`
                  : ''}
              </Typography>
            </div>
          </div>
        </div>

        <div className={classes.container}>
          {!related && (
            <Tooltip title={'Add related intervention'}>
              <IconButton
                style={{ width: 'fit-content' }}
                component="span"
                onClick={() => handleAddRelated(intervention.id)}
              >
                <PlaylistAddIcon />
              </IconButton>
            </Tooltip>
          )}

          {!expand ? (
            <IconButton
              style={{ width: 'fit-content' }}
              component="span"
              onClick={() => setSelectedIntervention(intervention)}
            >
              <ExpandMore className={classes.icon} />
            </IconButton>
          ) : (
            <IconButton
              style={{ width: 'fit-content' }}
              component="span"
              onClick={() => setSelectedIntervention({})}
            >
              <ExpandLess className={classes.icon} />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterventionTitle;
