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
import { COLORS } from '../../theme';
import CustomTooltip from '../CustomTooltip';

const SummaryStackedBar = props => {
  const {
    classes,
    greenIndicatorCount,
    yellowIndicatorCount,
    redIndicatorCount,
    skippedIndicatorCount,
    animationDuration
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
                  `${green} Green ${yellow} Yellow ${red} Red ${skipped} Skipped`
                }
              />
            }
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="green"
            stackId="a"
            fill={COLORS.GREEN}
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="yellow"
            stackId="a"
            fill={COLORS.YELLOW}
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="red"
            stackId="a"
            fill={COLORS.RED}
          />
          <Bar
            animationDuration={animationDuration}
            dataKey="skipped"
            stackId="a"
            fill={COLORS.LIGHT_GREY}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

SummaryStackedBar.defaultProps = {
  animationDuration: 0
};

const styles = () => ({
  mainContainer: {
    width: '100%'
  }
});

export default withStyles(styles)(SummaryStackedBar);
