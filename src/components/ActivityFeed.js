import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { COLORS } from '../theme';

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

  return (
    <>
      {data && (
        <div className={classes.container} style={{ width, minHeight: height }}>
          {data.map(({ familyName, createdAt, username, activityId }) => {
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
                className={classes.children}
                onClick={() => handleClick(env, activityId)}
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
                  <Typography className={classes.subtitle}>
                    {username}
                  </Typography>
                  <Typography className={classes.date}>
                    {daysAgoLabel}
                  </Typography>
                  <i className={`material-icons ${classes.arrowIcon}`}>
                    keyboard_arrow_right
                  </i>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
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
    overflow: 'scroll'
  },
  children: {
    cursor: 'pointer',
    width: '100%',
    display: 'flex',
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
    color: COLORS.TEXT_GREY,
    transform: 'rotate3d(50%,0,0)'
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
    color: COLORS.TEXT_GREY
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
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    color: COLORS.TEXT_GREY
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(
  withStyles(styles)(withTranslation()(ActivityFeed))
);
