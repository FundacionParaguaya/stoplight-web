import React from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import { COLORS } from '../theme';

const renderCustomizedLabel = ({ value, x, y }) => {
  const padding = 10;
  return (
    <g>
      <text
        style={{ fontFamily: 'Poppins' }}
        x={x}
        y={y - padding}
        textAnchor="top"
        dominantBaseline="top"
      >
        {value}
      </text>
    </g>
  );
};
const SummaryBarChart = ({
  greenIndicatorCount,
  yellowIndicatorCount,
  redIndicatorCount,
  skippedIndicatorCount,
  isAnimationActive
}) => {
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
    <BarChart
      width={240}
      height={240}
      data={data}
      barGap={32}
      barSize={18}
      layout="vertical"
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
      }}
    >
      <XAxis hide type="number" />
      <YAxis hide dataKey="name" type="category" />
      <Bar
        isAnimationActive={isAnimationActive}
        dataKey="green"
        fill={COLORS.GREEN}
      >
        <LabelList dataKey="green" content={renderCustomizedLabel} />
      </Bar>
      <Bar
        isAnimationActive={isAnimationActive}
        dataKey="yellow"
        fill={COLORS.YELLOW}
      >
        <LabelList dataKey="yellow" content={renderCustomizedLabel} />
      </Bar>
      <Bar
        isAnimationActive={isAnimationActive}
        dataKey="red"
        fill={COLORS.RED}
      >
        <LabelList dataKey="red" content={renderCustomizedLabel} />
      </Bar>
      <Bar
        isAnimationActive={isAnimationActive}
        dataKey="skipped"
        fill={COLORS.LIGHT_GREY}
      >
        <LabelList dataKey="skipped" content={renderCustomizedLabel} />
      </Bar>
    </BarChart>
  );
};

SummaryBarChart.defaultProps = {
  isAnimationActive: false
};

export default SummaryBarChart;
