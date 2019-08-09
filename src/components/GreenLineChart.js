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
import { Typography } from '@material-ui/core';
import { COLORS } from '../theme';
import CustomTooltip from './CustomTooltip';

const { GREEN } = COLORS;

const GreenLineChart = withTranslation()(({ data, width, height, t }) => {
  if (!data) {
    return (
      <Typography style={{ width }}>
        {t('views.organizationsFilter.noMatchFilters')}
      </Typography>
    );
  }

  return (
    <ResponsiveContainer width={width || '100%'} height={height || 250}>
      <LineChart data={data} margin={{ bottom: 5, left: 0, right: 25, top: 5 }}>
        >
        <XAxis
          dataKey="date"
          tickLine={false}
          tick={{ fontFamily: 'Poppins', fontSize: 14 }}
          stroke="#909090"
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
          stroke="#909090"
          padding={{ bottom: 5 }}
        />
        <Tooltip
          content={
            <CustomTooltip
              format={({ surveys, date }) =>
                `${surveys} ${t('views.survey.surveys')} - ${moment(
                  date
                ).format('MMMM YYYY')}`
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
});

export default GreenLineChart;
