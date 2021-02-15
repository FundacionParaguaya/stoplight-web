import React from 'react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  LabelList,
  XAxis,
  YAxis
} from 'recharts';
import { COLORS } from '../../theme';
import countries from 'localized-countries';
import { useTranslation } from 'react-i18next';

const renderCustomizedLabel = (
  { value, x, y },
  countryCode,
  language,
  countriesTotal
) => {
  let countryOptions = countries(
    require(`localized-countries/data/${language === 'ht' ? 'en' : language}`)
  ).array();
  let country = countryOptions.find(country => country.code === countryCode);

  return (
    <g>
      <text
        style={{ fontFamily: 'Poppins', fontSize: 14 }}
        x={x}
        y={y - 5}
        textAnchor="top"
        dominantBaseline="top"
      >
        {value} {!!country ? country.label : ''}{' '}
        {Math.round((value / countriesTotal) * 100) + '%'}
      </text>
    </g>
  );
};

const CountriesChart = ({ countriesCode, countriesCount, countriesTotal }) => {
  const {
    i18n: { language }
  } = useTranslation();
  return (
    <ResponsiveContainer height={200} width="100%">
      <BarChart
        data={countriesCount}
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
        <Bar isAnimationActive={false} dataKey="first" fill={COLORS.GREEN}>
          <LabelList
            dataKey="first"
            content={e =>
              renderCustomizedLabel(
                e,
                countriesCode[0],
                language,
                countriesTotal
              )
            }
          />
        </Bar>

        {!!countriesCount[0]['second'] && (
          <Bar
            isAnimationActive={false}
            dataKey="second"
            fill={'rgba(80, 170, 71, 0.8)'}
          >
            <LabelList
              dataKey="second"
              content={e =>
                renderCustomizedLabel(
                  e,
                  countriesCode[1],
                  language,
                  countriesTotal
                )
              }
            />
          </Bar>
        )}
        {!!countriesCount[0]['third'] && (
          <Bar
            isAnimationActive={false}
            dataKey="third"
            fill={'rgba(80, 170, 71, 0.4)'}
          >
            <LabelList
              dataKey="third"
              content={e =>
                renderCustomizedLabel(
                  e,
                  countriesCode[2],
                  language,
                  countriesTotal
                )
              }
            />
          </Bar>
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CountriesChart;
