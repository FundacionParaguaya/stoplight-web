import React from 'react';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import iconAchievement from '../assets/icon_achievement.png';
import iconPriority from '../assets/icon_priority.png';
import { COLORS } from '../theme';

const CountDetail = ({
  type,
  count,
  classes,
  t,
  label,
  removeBorder,
  countVariant
}) => {
  const [PRIORITY, ACHIEVEMENT] = ['priority', 'achievement'];

  const renderCount = innerCount => (
    <Typography variant={countVariant} className={classes.count}>
      {innerCount.toString()}
    </Typography>
  );

  const renderLabel = innerLabel => (
    <Typography variant="h6" className={classes.label}>
      {innerLabel}
    </Typography>
  );

  return (
    <>
      {type === PRIORITY && (
        <div className={classes.countContainer}>
          <div className={classes.innerContainer}>
            <img
              src={iconPriority}
              alt="Priority"
              width="18"
              height="18"
              className={clsx(
                classes.icon,
                removeBorder && classes.iconWithoutBorders
              )}
            />
            {renderCount(count)}
          </div>
          {label && renderLabel(t('views.dashboard.priorities'))}
        </div>
      )}
      {type === ACHIEVEMENT && (
        <div className={classes.countContainer}>
          <div className={classes.innerContainer}>
            <img
              src={iconAchievement}
              alt="Achievement"
              width="18"
              height="18"
              className={clsx(
                classes.icon,
                removeBorder && classes.iconWithoutBorders
              )}
            />
            {renderCount(count)}
          </div>
          {label && renderLabel(t('views.dashboard.achievements'))}
        </div>
      )}
    </>
  );
};

CountDetail.defaultProps = {
  countVariant: 'body2',
  label: false
};

const styles = theme => ({
  countContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      marginRight: '10px'
    }
  },
  count: {
    minWidth: 15,
    textAlign: 'right'
  },
  icon: {
    border: '3px solid #fff',
    borderRadius: '50%',
    boxSizing: 'content-box',
    backgroundColor: '#fff'
  },
  iconWithoutBorders: {
    borderColor: 'rgba(0,0,0,0)',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  label: {
    textAlign: 'center',
    color: COLORS.TEXT_LIGHTGREY
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default withTranslation()(withStyles(styles)(CountDetail));
