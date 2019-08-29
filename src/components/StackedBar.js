import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { withTranslation } from 'react-i18next';
import { COLORS } from '../theme';
import CustomTooltip from './CustomTooltip';

const StackedBar = props => {
  const {
    classes,
    greenIndicatorCount,
    yellowIndicatorCount,
    redIndicatorCount,
    skippedIndicatorCount,
    animationDuration,
    t
  } = props;
  const data = [
    {
      name: 'data',
      red: redIndicatorCount,
      yellow: yellowIndicatorCount,
      green: greenIndicatorCount,
      skipped: skippedIndicatorCount
    }
  ];
  const shouldAnimate = animationDuration > 0;
  const getTranslated = name => t(`views.dashboard.${name}`);

  return (
    <div className={classes.mainContainer}>
      <ResponsiveContainer height={20} width="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
          }}
          maxBarSize={9}
          className={classes.barChartStyle}
        >
          <XAxis
            hide
            type="number"
            domain={[
              0,
              greenIndicatorCount +
                yellowIndicatorCount +
                redIndicatorCount +
                skippedIndicatorCount
            ]}
          />
          <YAxis hide dataKey="name" type="category" />
          <Tooltip
            cursor={false}
            content={
              <CustomTooltip
                format={({ green, red, skipped, yellow }) =>
                  `${green} ${getTranslated('green')} ${yellow} ${getTranslated(
                    'yellow'
                  )} ${red} ${getTranslated('red')} ${skipped} ${getTranslated(
                    'skipped'
                  )}`
                }
              />
            }
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="green"
            stackId="a"
            fill={COLORS.GREEN}
            isAnimationActive={shouldAnimate}
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="yellow"
            stackId="a"
            fill={COLORS.YELLOW}
            isAnimationActive={shouldAnimate}
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="red"
            stackId="a"
            fill={COLORS.RED}
            isAnimationActive={shouldAnimate}
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="skipped"
            stackId="a"
            fill={COLORS.LIGHT_GREY}
            isAnimationActive={shouldAnimate}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

StackedBar.defaultProps = {
  animationDuration: 0
};

const styles = () => ({
  mainContainer: {
    width: '100%'
  }
});

export default withTranslation()(withStyles(styles)(StackedBar));
