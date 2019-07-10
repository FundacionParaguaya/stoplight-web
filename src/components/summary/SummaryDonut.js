import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Typography } from '@material-ui/core';
import { Spring } from 'react-spring/renderprops';
import { capitalize } from 'lodash';
import { COLORS } from '../../theme';
import CustomTooltip from '../CustomTooltip';
import IndicatorBall from './IndicatorBall';

let SummaryCountingSection = props => (
  <div className={props.classes.container}>
    <Spring
      config={{ tension: 150, friction: 40, precision: 1 }}
      from={{ number: props.isAnimationActive ? 0 : props.count }}
      to={{ number: props.count }}
    >
      {p => (
        <Typography variant="h5" className={props.classes.typographyStyle}>
          {Number.parseInt(p.number, 10)}
        </Typography>
      )}
    </Spring>
    <div className={props.classes.itemSeparator} />
    <IndicatorBall color={props.color} variant="tiny" animated={false} />
    <div className={props.classes.itemSeparator} />
    <Typography variant="subtitle1" noWrap>
      {props.label}
    </Typography>
  </div>
);
const summaryCountingSectionStyles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemSeparator: {
    width: theme.spacing(2)
  },
  typographyStyle: {
    width: '2em',
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

SummaryCountingSection = withStyles(summaryCountingSectionStyles)(
  SummaryCountingSection
);

const SummaryDonut = props => {
  const {
    classes,
    greenIndicatorCount,
    yellowIndicatorCount,
    redIndicatorCount,
    skippedIndicatorCount,
    t,
    countingSection,
    isAnimationActive
  } = props;
  const data = [
    { name: 'red', value: redIndicatorCount },
    { name: 'yellow', value: yellowIndicatorCount },
    { name: 'green', value: greenIndicatorCount },
    { name: 'skipped', value: skippedIndicatorCount }
  ];
  const total =
    redIndicatorCount +
    yellowIndicatorCount +
    greenIndicatorCount +
    skippedIndicatorCount;

  return (
    <div className={classes.mainContainer}>
      <div className={classes.donutContainer}>
        <PieChart width={235} height={240}>
          <Pie
            data={data}
            isAnimationActive={isAnimationActive}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={110}
            paddingAngle={0}
          >
            <Cell fill={COLORS.RED} stroke={COLORS.RED} />
            <Cell fill={COLORS.YELLOW} stroke={COLORS.YELLOW} />
            <Cell fill={COLORS.GREEN} stroke={COLORS.GREEN} />
            <Cell fill={COLORS.LIGHT_GREY} stroke={COLORS.LIGHT_GREY} />
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                format={({ value, name }) =>
                  `${Math.round((value * 100) / total)}% ${capitalize(name)}`
                }
              />
            }
          />
        </PieChart>
      </div>
      {countingSection && (
        <div className={classes.summaryCountingSectionContainer}>
          <SummaryCountingSection
            label={t('views.overview.green')}
            count={greenIndicatorCount}
            color="green"
          />
          <SummaryCountingSection
            label={t('views.overview.yellow')}
            count={yellowIndicatorCount}
            color="yellow"
          />
          <SummaryCountingSection
            label={t('views.overview.red')}
            count={redIndicatorCount}
            color="red"
          />
          <SummaryCountingSection
            label={t('views.overview.skipped')}
            count={skippedIndicatorCount}
            color="skipped"
          />
        </div>
      )}
    </div>
  );
};

SummaryDonut.defaultProps = {
  isAnimationActive: false,
  countingSection: true
};

const styles = theme => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  donutContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  summaryCountingSectionContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  }
});

SummaryDonut.defaultProps = {
  variant: 'normal',
  animated: true
};

export default withStyles(styles)(withTranslation()(SummaryDonut));
