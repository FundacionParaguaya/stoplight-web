import React, { useState } from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
  Legend
} from 'recharts';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { COLORS } from '../theme';
import CustomTooltip from './CustomTooltip';

import { makeStyles } from '@material-ui/core/styles';

const { GREEN, RED, YELLOW, GREY, LIGHT_GREY } = COLORS;

const useStyles = makeStyles(theme => ({
  greenDot: {
    textDecoration: 'none',
    height: '10px',
    width: '10px',
    backgroundColor: GREEN,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 5
  },
  greyDot: {
    textDecoration: 'none',
    height: '10px',
    width: '10px',
    backgroundColor: GREY,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 5
  },
  ligthDot: {
    textDecoration: 'none',
    height: '10px',
    width: '10px',
    backgroundColor: LIGHT_GREY,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 5
  },
  legendContainer: {
    listStyleType: 'none',
    textAlign: 'left'
  },
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5
  }
}));

const GreenLineChart = withTranslation()(({ data, width, height, t }) => {
  const [tooltipText, setToltipText] = useState('');
  const classes = useStyles();
  if (!data) {
    return (
      <Typography style={{ width }}>
        {t('views.organizationsFilter.noMatchFilters')}
      </Typography>
    );
  }

  const calculateTooltipInfo = ({ dataKey, payload }) => {
    let tooltipLabel;
    switch (dataKey) {
      case 'first':
        tooltipLabel = `${payload[dataKey]} ${t(
          'views.survey.baseLine'
        )} - ${moment(payload['date']).format('MMMM YYYY')} `;
        setToltipText(tooltipLabel);
        break;
      case 'totalRetakes':
        const retakesList = payload.retakesBySnapNumber
          .map((number, index) => {
            return `• ${number} N˚${index + 2} ${t('views.survey.followUp')}`;
          })
          .join(' \n ');
        tooltipLabel = `${payload[dataKey]} ${t(
          'views.survey.followUp'
        )} - ${moment(payload['date']).format('MMMM YYYY')} ${'\n' +
          retakesList} `;
        setToltipText(tooltipLabel);
        break;
      case 'total':
        tooltipLabel = `${payload[dataKey]} ${t(
          'views.survey.surveys'
        )} - ${moment(payload['date']).format('MMMM YYYY')} `;
        setToltipText(tooltipLabel);
        break;
      default:
        return;
    }
  };

  return (
    <ResponsiveContainer width={width || '100%'} height={height || 250}>
      <LineChart data={data} margin={{ bottom: 5, left: 0, right: 25, top: 5 }}>
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
        <Legend
          content={
            <ul className={classes.legendContainer}>
              <li className={classes.legendItem}>
                <span className={classes.greenDot}></span>
                <Typography variant="subtitle2">
                  {t('views.survey.totalSurveys')}
                </Typography>
              </li>
              <li className={classes.legendItem}>
                <span className={classes.greyDot}></span>
                <Typography variant="subtitle2">
                  {t('views.survey.baseLine')}
                </Typography>
              </li>
              <li className={classes.legendItem}>
                <span className={classes.ligthDot}></span>
                <Typography variant="subtitle2">
                  {t('views.survey.followUp')}
                </Typography>
              </li>
            </ul>
          }
        />

        <Tooltip
          content={<CustomTooltip format={() => tooltipText} />}
          cursor={false}
        />

        <Line
          isAnimationActive={false}
          type="linear"
          dataKey="total"
          stroke={GREEN}
          strokeWidth="2"
          activeDot={true}
          dot={{ fill: GREEN, strokeWidth: 2 }}
          activeDot={{ onMouseEnter: event => calculateTooltipInfo(event) }}
        />
        <Line
          isAnimationActive={false}
          type="linear"
          dataKey="first"
          stroke={GREY}
          strokeWidth="2"
          dot={{ fill: GREY, strokeWidth: 2 }}
          activeDot={{ onMouseEnter: event => calculateTooltipInfo(event) }}
        />
        <Line
          isAnimationActive={false}
          type="linear"
          dataKey="totalRetakes"
          stroke={LIGHT_GREY}
          strokeWidth="2"
          dot={{ fill: LIGHT_GREY, strokeWidth: 2 }}
          activeDot={{ onMouseEnter: event => calculateTooltipInfo(event) }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

export default GreenLineChart;
