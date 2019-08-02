import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Spring } from 'react-spring/renderprops';
import clsx from 'clsx';
import iconPriority from '../../assets/icon_priority.png';
import iconAchievement from '../../assets/icon_achievement.png';
import { COLORS } from '../../theme';

let Accent = ({ classes, variant, achievement, priority }) => (
  <React.Fragment>
    {variant === 'small' && (achievement || priority) && (
      <div className={classes.dotAccent} />
    )}
    {variant === 'normal' && (achievement || priority) && (
      <div className={classes.priorityOrAchievementAccent}>
        <img
          src={achievement ? iconAchievement : iconPriority}
          style={{
            width: 27,
            height: 27,
            border: '2px solid #FFFFFF',
            borderRadius: '50%',
            backgroundColor: '#fff'
          }}
          alt=""
        />
      </div>
    )}
  </React.Fragment>
);

const accentStyle = () => ({
  dotAccent: {
    boxSizing: 'border-box',
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#77ABE9',
    width: 14,
    height: 14,
    position: 'absolute',
    top: -5,
    right: -5
  },
  priorityOrAchievementAccent: {
    position: 'absolute',
    top: -5,
    right: -5
  }
});
Accent = withStyles(accentStyle)(Accent);

const IndicatorBall = props => {
  const { classes, variant, color, animated, achievement, priority } = props;
  const indicatorClassName = clsx(classes.root, {
    [classes.redIndicator]: color === 'red',
    [classes.yellowIndicator]: color === 'yellow',
    [classes.greenIndicator]: color === 'green',
    [classes.skippedIndicator]: color === 'skipped'
  });
  const diameter = useMemo(() => {
    let d = 60;
    if (variant === 'small') {
      d = 26;
    } else if (variant === 'tiny') {
      d = 12;
    }
    return d;
  }, [variant]);
  return (
    <div style={{ width: diameter, height: diameter, position: 'relative' }}>
      <Spring
        config={{ tension: 150, friction: 40, precision: 1 }}
        from={{ number: animated ? 0 : diameter }}
        to={{ number: diameter }}
      >
        {sprintProps => (
          <React.Fragment>
            <div
              className={indicatorClassName}
              style={{ width: sprintProps.number, height: sprintProps.number }}
            />
            <Accent
              variant={variant}
              animated={animated}
              achievement={achievement}
              priority={priority}
            />
          </React.Fragment>
        )}
      </Spring>
    </div>
  );
};

const styles = () => ({
  root: {
    borderRadius: '50%'
  },
  redIndicator: {
    backgroundColor: COLORS.RED
  },
  yellowIndicator: {
    backgroundColor: COLORS.YELLOW
  },
  greenIndicator: {
    backgroundColor: COLORS.GREEN
  },
  skippedIndicator: {
    backgroundColor: COLORS.LIGHT_GREY
  }
});

IndicatorBall.defaultProps = {
  variant: 'normal',
  animated: true,
  achievement: false,
  priority: false
};

export default withStyles(styles)(IndicatorBall);
