import React from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { COLORS } from '../theme';
import CustomTooltip from './CustomTooltip';
import { getDateFormatByLocale } from '../utils/date-utils';

const { GREEN } = COLORS;

const GreenLineChart = withTranslation()(
  ({ data, language, width, height }) => {
    const formatDate = getDateFormatByLocale(language);

    return (
      <ResponsiveContainer width={width || '100%'} height={height || 250}>
        <LineChart
          data={data}
          margin={{ bottom: 5, left: 0, right: 25, top: 5 }}
        >
          >
          <XAxis
            dataKey="date"
            tickLine={false}
            tick={{ fontFamily: 'Poppins', fontSize: 14 }}
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
            tick={{ fontFamily: 'Poppins', fontSize: 14 }}
            stroke="#D8D8D8"
            padding={{ bottom: 5 }}
          />
          <Tooltip
            content={
              <CustomTooltip
                format={({ surveys, date }) =>
                  `${surveys} Surveys ${moment(date).format(formatDate)}`
                }
              />
            }
            cursor={false}
          />
          {data && (
            <Line
              isAnimationActive={false}
              type="linear"
              dataKey="surveys"
              stroke={GREEN}
              strokeWidth="2"
              dot={{ fill: GREEN, strokeWidth: 2 }}
              activeDot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  }
);

export default GreenLineChart;
