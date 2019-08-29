import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { COLORS } from '../../theme';

const ActivityFeed = ({
  classes,
  data,
  width = '40%',
  height = 200,
  user: { env },
  t
}) => {
  const handleClick = (e, familyId) => {
    window.location.replace(
      `https://${e}.povertystoplight.org/#families/${familyId}`
    );
  };

  if (!data || data.length <= 0) {
    return (
      <Typography align="center">
        {t('views.organizationsFilter.noMatchFilters')}
      </Typography>
    );
  }

  return (
    <div className={classes.container} style={{ width, minHeight: height }}>
      <div className={classes.overlay} />
      <div className={classes.childrenContainer}>
        {data.map(
          ({ familyName, createdAt, username, activityId, familyId }) => {
            const createdDaysAgo = moment().diff(createdAt, 'days');
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
                key={activityId}
                className={`${classes.children} ${
                  familyId ? classes.clickable : null
                }`}
                onClick={() => (familyId ? handleClick(env, familyId) : null)}
              >
                <div className={classes.iconContainer}>
                  <i className={`material-icons ${classes.primaryIcon}`}>
                    swap_calls
                  </i>
                </div>
                <div className={classes.content}>
                  <Typography className={classes.title}>
                    {familyName}
                  </Typography>
                  {username && (
                    <Typography className={classes.subtitle}>
                      {`${t('views.activityFeed.facilitator')}: ${username}`}
                    </Typography>
                  )}
                  <Typography className={classes.date}>
                    {daysAgoLabel}
                  </Typography>
                  {familyId && (
                    <i className={`material-icons ${classes.arrowIcon}`}>
                      keyboard_arrow_right
                    </i>
                  )}
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
    maxHeight: 200,
    borderLeft: `1px solid ${theme.palette.grey.light}`,
    position: 'relative'
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    background:
      'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(46,46,46,0) 30%)',
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
    display: 'flex'
  },
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  iconContainer: {
    width: 60,
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
    borderBottom: '1px solid #E6E4E2',
    width: 'calc(100% - 60px)',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_GREY,
    textTransform: 'capitalize'
  },
  date: {
    fontSize: 13,
    color: COLORS.TEXT_GREY,
    right: 25,
    lineHeight: '14px',
    position: 'absolute',
    bottom: 10
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
