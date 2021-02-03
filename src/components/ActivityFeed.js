import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { COLORS } from '../theme';
import { redirectUrlPerType, activityTypes } from './../utils/activities-utils';
import stoplightImg from '../assets/stoplight-taken.png';
import solutionImg from '../assets/solution.png';
import priorityImg from '../assets/priority.png';

const ActivityFeed = ({
  classes,
  data,
  width = '40%',
  height = 200,
  t,
  history
}) => {
  const handleClick = (activityType, referenceId, familyId) => {
    let id = !!referenceId ? referenceId : familyId;
    history.push(redirectUrlPerType[activityType].replace('$referenceId', id));
  };

  const getTitle = (activityType, familyName) => {
    let title = t(`views.activityFeed.title.${activityType}`);
    title = title.replace('$familyName', familyName);
    return title;
  };

  const getImage = activityType => {
    if (activityType === activityTypes.NEW_STOPLIGHT_SOLUTION) {
      return solutionImg;
    } else if (activityType === activityTypes.NEW_STOPLIGHT_PRIORITY) {
      return priorityImg;
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
            familyName,
            createdAt,
            username,
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

            return (
              <div
                key={id}
                className={`${classes.children} ${classes.clickable}`}
                onClick={() => handleClick(activityType, referenceId, familyId)}
              >
                <div className={classes.iconContainer}>
                  <img alt="icon" src={getImage(activityType)} width="48px" />
                </div>
                <div className={classes.content}>
                  <Typography className={classes.title}>
                    {getTitle(activityType, familyName)}
                  </Typography>
                  {username && (
                    <Typography className={classes.label}>
                      <span className={classes.subtitle}>
                        {t('views.activityFeed.facilitator')}
                      </span>
                      {`: ${username}`}
                    </Typography>
                  )}
                  {stoplightClient && (
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
    justifyContent: 'center'
  },
  primaryIcon: {
    color: theme.palette.grey.main,
    transform: 'rotate(90deg)'
  },
  content: {
    position: 'relative',
    paddingTop: 15,
    paddingBottom: 20,
    paddingRigth: 5,
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
    bottom: 10,
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
