import { Typography, withStyles } from '@material-ui/core';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import interventionImg from '../assets/intervention_feed.png';
import priorityImg from '../assets/priority.png';
import solutionImg from '../assets/solution.png';
import stoplightImg from '../assets/stoplight-taken.png';
import { COLORS } from '../theme';
import { checkAccess } from '../utils/role-utils';
import { activityTypes, redirectUrlPerType } from './../utils/activities-utils';

const ActivityFeed = ({
  classes,
  data,
  width = '40%',
  height = 200,
  t,
  history,
  user
}) => {
  const handleClick = (activityType, referenceId, familyId) => {
    let id = !!referenceId ? referenceId : familyId;
    if (activityType === activityTypes.NEW_STOPLIGHT_SOLUTION && !!id) {
      history.push(
        redirectUrlPerType[activityType].replace('$referenceId', id)
      );
    } else if (checkAccess(user, 'families') && !!id) {
      history.push(
        redirectUrlPerType[activityType].replace('$referenceId', id)
      );
    }
  };

  const getImage = activityType => {
    if (activityType === activityTypes.NEW_STOPLIGHT_SOLUTION) {
      return solutionImg;
    } else if (activityType === activityTypes.NEW_STOPLIGHT_PRIORITY) {
      return priorityImg;
    } else if (activityType === activityTypes.NEW_INTERVENTION) {
      return interventionImg;
    } else {
      return stoplightImg;
    }
  };

  if (!data || data.length <= 0) {
    return (
      <Typography>{t('views.organizationsFilter.noMatchFilters')}</Typography>
    );
  }

  return (
    <div className={classes.container} style={{ width, height: height }}>
      <div className={classes.overlay} />
      <div className={classes.childrenContainer}>
        {data.map(
          ({
            createdAt,
            username,
            message,
            params,
            id,
            familyId,
            stoplightClient,
            activityType,
            referenceId
          }) => {
            let date = moment(createdAt, 'DD/MM/YYYY HH:SS');
            const createdDaysAgo = moment().diff(date, 'days');
            let daysAgoLabel = t('views.activityFeed.today');
            if (createdDaysAgo === 1) {
              daysAgoLabel = t('views.activityFeed.dayAgo');
            } else if (createdDaysAgo > 1) {
              daysAgoLabel = t('views.activityFeed.daysAgo').replace(
                '$dd',
                createdDaysAgo
              );
            }
            const isSolution =
              activityType === activityTypes.NEW_STOPLIGHT_SOLUTION;
            const isPriority =
              activityType === activityTypes.NEW_STOPLIGHT_PRIORITY;
            return (
              <div
                key={id}
                className={clsx(
                  classes.children,
                  (activityType === activityTypes.NEW_STOPLIGHT_SOLUTION ||
                    checkAccess(user, 'families')) &&
                    classes.clickable
                )}
                onClick={() => handleClick(activityType, referenceId, familyId)}
              >
                <div className={classes.iconContainer}>
                  <img alt="icon" src={getImage(activityType)} width="48px" />
                </div>
                <div className={classes.content}>
                  <Typography className={classes.title}>{message}</Typography>
                  {isSolution && (
                    <Typography
                      className={clsx(classes.label, classes.solutionTitle)}
                    >
                      <span className={classes.subtitle}>
                        {t('views.activityFeed.title')}
                      </span>
                      {`: ${params[0]}`}
                    </Typography>
                  )}
                  {isPriority && (
                    <Typography className={classes.label}>
                      <span className={classes.subtitle}>
                        {t('views.activityFeed.indicator')}
                      </span>
                      {`: ${params[1]}`}
                    </Typography>
                  )}
                  {username && !isPriority && (
                    <Typography className={classes.label}>
                      <span className={classes.subtitle}>
                        {!isSolution
                          ? t('views.activityFeed.facilitator')
                          : t('views.activityFeed.uploadedBy')}
                      </span>
                      {`: ${isSolution && !!params[1] ? params[1] : username}`}
                    </Typography>
                  )}
                  {stoplightClient && !isSolution && (
                    <Typography className={classes.label}>
                      <span className={classes.subtitle}>
                        {t('views.activityFeed.origin')}
                      </span>
                      {`: ${stoplightClient}`}
                    </Typography>
                  )}
                  <Typography className={classes.date}>
                    {daysAgoLabel}
                  </Typography>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

ActivityFeed.defaultProps = {
  data: []
};

const styles = theme => ({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '40%',
    maxHeight: '80vh',
    borderLeft: `1px solid ${theme.palette.grey.light}`,
    position: 'relative'
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    pointerEvents: 'none'
  },
  childrenContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    overflowY: 'scroll'
  },
  children: {
    width: '100%',
    display: 'flex',
    marginTop: 10,
    marginBottom: 10
  },
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  iconContainer: {
    width: 65,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  primaryIcon: {
    color: theme.palette.grey.main,
    transform: 'rotate(90deg)'
  },
  content: {
    position: 'relative',
    paddingTop: 15,
    paddingBottom: 20,
    paddingRight: 5,
    borderBottom: '1px solid #E6E4E2',
    width: 'calc(100% - 60px)',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: 500
  },
  solutionTitle: {
    maxWidth: 210,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  label: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: COLORS.TEXT_GREY,
    textTransform: 'capitalize'
  },
  subtitle: {
    fontWeight: 500,
    color: 'black'
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: COLORS.TEXT_GREY,
    right: 25,
    lineHeight: '14px',
    position: 'absolute',
    bottom: 3,
    fontStyle: 'italic'
  },
  arrowIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: 'translateY(-70%)',
    color: theme.palette.grey.main
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(
  withStyles(styles)(withTranslation()(ActivityFeed))
);
