import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Spring } from 'react-spring/renderprops';
import clsx from 'clsx';
import { COLORS } from '../../theme';

const IndicatorBall = props => {
  const { classes, variant, color, animated } = props;
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
    <div style={{ width: diameter, height: diameter }}>
      <Spring
        config={{ tension: 150, friction: 40, precision: 1 }}
        from={{ number: animated ? 0 : diameter }}
        to={{ number: diameter }}
      >
        {sprintProps => (
          <div
            className={indicatorClassName}
            style={{ width: sprintProps.number, height: sprintProps.number }}
          />
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
  animated: true
};

export default withStyles(styles)(IndicatorBall);
