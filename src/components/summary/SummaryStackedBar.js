import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { COLORS } from '../../theme';

const SummaryStackedBar = props => {
  const {
    classes,
    greenIndicatorCount,
    yellowIndicatorCount,
    redIndicatorCount,
    skippedIndicatorCount
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
      <ResponsiveContainer height={9} width="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0
          }}
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
          <Bar
            animationDuration={0}
            dataKey="green"
            stackId="a"
            fill={COLORS.GREEN}
          />
          <Bar
            animationDuration={0}
            dataKey="yellow"
            stackId="a"
            fill={COLORS.YELLOW}
          />
          <Bar
            animationDuration={0}
            dataKey="red"
            stackId="a"
            fill={COLORS.RED}
          />
          <Bar
            animationDuration={0}
            dataKey="skipped"
            stackId="a"
            fill={COLORS.LIGHT_GREY}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = () => ({
  mainContainer: {
    width: '100%'
  }
});

export default withStyles(styles)(SummaryStackedBar);
