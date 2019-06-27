import React from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { COLORS } from '../theme';
import CustomTooltip from './CustomTooltip';
import { getDateFormatByLocale } from '../utils/date-utils';

const { GREEN } = COLORS;

const GreenLineChart = withTranslation()(({ data, language }) => {
  const formatDate = getDateFormatByLocale(language);

  return (
    <LineChart
      width={730}
      height={250}
      data={data}
      margin={{ bottom: 30, left: 25, right: 30, top: 25 }}
    >
      >
      <XAxis
        dataKey="date"
        tickLine={false}
        tick={{ fontFamily: 'Poppins' }}
        stroke="#D8D8D8"
        tickSize={20}
        tickFormatter={tick =>
          moment(tick)
            .format('MMM')
            .toUpperCase()
        }
      />
      <YAxis
        interval={1}
        tickLine={false}
        tickSize={20}
        tick={{ fontFamily: 'Poppins' }}
        stroke="#D8D8D8"
        padding={{ bottom: 5 }}
      />
      <Tooltip
        content={
          <CustomTooltip
            format={({ value, name }) =>
              `${value} Surveys ${moment(name).format(formatDate)}`
            }
          />
        }
        cursor={false}
      />
      <Line
        isAnimationActive={false}
        type="linear"
        dataKey="surveys"
        stroke={GREEN}
        strokeWidth="3"
        dot={{ fill: GREEN, strokeWidth: 2 }}
        activeDot={false}
      />
    </LineChart>
  );
});

export default GreenLineChart;
