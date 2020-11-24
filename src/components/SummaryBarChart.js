import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer
} from 'recharts';
import { withTranslation } from 'react-i18next';
import { COLORS } from '../theme';

const renderCustomizedLabel = ({ value, x, y }, label) => {
  const padding = 10;

  return (
    <g>
      <text
        style={{ fontFamily: 'Poppins', fontSize: 14 }}
        x={x}
        y={y - padding}
        textAnchor="top"
        dominantBaseline="top"
      >
        {value} {label}
      </text>
    </g>
  );
};
const SummaryBarChart = ({
  greenIndicatorCount,
  yellowIndicatorCount,
  redIndicatorCount,
  skippedIndicatorCount,
  isAnimationActive,
  t,
  width,
  height
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
    <ResponsiveContainer width={width} height={!!height ? height : 240}>
      <BarChart
        data={data}
        barGap={35}
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
          <LabelList
            dataKey="green"
            content={e => renderCustomizedLabel(e, t('views.dashboard.green'))}
          />
        </Bar>
        <Bar
          isAnimationActive={isAnimationActive}
          dataKey="yellow"
          fill={COLORS.YELLOW}
        >
          <LabelList
            dataKey="yellow"
            content={e => renderCustomizedLabel(e, t('views.dashboard.yellow'))}
          />
        </Bar>
        <Bar
          isAnimationActive={isAnimationActive}
          dataKey="red"
          fill={COLORS.RED}
        >
          <LabelList
            dataKey="red"
            content={e => renderCustomizedLabel(e, t('views.dashboard.red'))}
          />
        </Bar>
        {skippedIndicatorCount !== 0 && (
          <Bar
            isAnimationActive={isAnimationActive}
            dataKey="skipped"
            fill={COLORS.LIGHT_GREY}
          >
            <LabelList
              dataKey="skipped"
              content={e =>
                renderCustomizedLabel(e, t('views.dashboard.skipped'))
              }
            />
          </Bar>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

SummaryBarChart.defaultProps = {
  isAnimationActive: false
};

export default withTranslation()(SummaryBarChart);
