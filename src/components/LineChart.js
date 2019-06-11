import React from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { withStyles } from '@material-ui/core';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { COLORS } from '../theme';
import { getDateFormatByLocale } from '../utils/date-utils';

const { GREEN } = COLORS;

const GreenLineChart = ({ data }) => {
  return (
    <LineChart
      width={730}
      height={300}
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
        tickLine={false}
        tickSize={20}
        tick={{ fontFamily: 'Poppins' }}
        stroke="#D8D8D8"
        padding={{ bottom: 5 }}
      />
      <Tooltip content={<CustomTooltip />} cursor={false} />
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
};

const customTooltip = {
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: '0.9em',
    borderRadius: 3,
    margin: 0,
    padding: '7px 10px'
  },
  label: {
    margin: 0
  }
};

const CustomTooltip = withTranslation()(
  withStyles(customTooltip)(({ active, payload, label, classes, language }) => {
    const formatDate = getDateFormatByLocale(language);

    if (active) {
      return (
        <div className={classes.wrapper}>
          <p className={classes.label}>{`${payload[0].value} Surveys ${moment(
            label
          ).format(formatDate)}`}</p>
        </div>
      );
    }

    return null;
  })
);

export default GreenLineChart;
