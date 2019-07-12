import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { capitalize } from 'lodash';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import CountDetail from './CountDetail';
import CustomTooltip from './CustomTooltip';
import { COLORS } from '../theme';

const donutStyles = {
  container: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 30,
    height: 30
  }
};

const IndicatorsDonut = withStyles(donutStyles)(
  ({
    redIndicatorCount,
    yellowIndicatorCount,
    greenIndicatorCount,
    skippedIndicatorCount,
    icon,
    classes
  }) => {
    const data = [
      { name: 'red', value: redIndicatorCount },
      { name: 'yellow', value: yellowIndicatorCount },
      { name: 'green', value: greenIndicatorCount },
      { name: 'skipped', value: skippedIndicatorCount }
    ];

    return (
      <div className={classes.container}>
        {icon && <img src={icon} className={classes.icon} />}
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={27.5}
            outerRadius={40}
            paddingAngle={0}
            isAnimationActive={false}
          >
            <Cell fill={COLORS.RED} stroke={COLORS.RED} />
            <Cell fill={COLORS.YELLOW} stroke={COLORS.YELLOW} />
            <Cell fill={COLORS.GREEN} stroke={COLORS.GREEN} />
            <Cell fill={COLORS.LIGHT_GREY} stroke={COLORS.LIGHT_GREY} />
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                format={({ value, name }) => `${value} ${capitalize(name)}`}
              />
            }
          />
        </PieChart>
      </div>
    );
  }
);

const alignByIndex = index => {
  if (index % 3 === 0) return 'flexStart';
  if ((index - 2) % 3 === 0) return 'flexEnd';
  return null;
};

const parseStoplights = stoplights => {
  const getByIndex = i => (stoplights[i] ? stoplights[i].count : 0);

  const green = getByIndex(3);
  const yellow = getByIndex(2);
  const red = getByIndex(1);
  const skipped = getByIndex(0);

  return [green, yellow, red, skipped];
};

const PieGrid = ({ classes, items }) => {
  return (
    <Grid container>
      {items.map((indicator, index) => {
        const [green, yellow, red, skipped] = parseStoplights(
          indicator.stoplights
        );
        return (
          <Grid
            item
            xs={4}
            key={`donut${indicator.name || indicator.dimension}`}
            className={`${classes.pieContainer} ${
              classes[alignByIndex(index)]
            }`}
          >
            <div className={classes.pieInnerContainer}>
              <div className={classes.detailContainer}>
                <CountDetail border count={14} type="achievement" />
                <CountDetail border count={4} type="priority" />
              </div>
              <IndicatorsDonut
                greenIndicatorCount={green}
                yellowIndicatorCount={yellow}
                redIndicatorCount={red}
                skippedIndicatorCount={skipped}
                icon={indicator.icon}
              />
              <Typography variant="subtitle2" className={classes.title}>
                {indicator.name || indicator.dimension}
              </Typography>
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
};

const styles = theme => ({
  barContainer: {
    padding: `${theme.spacing()}px ${theme.spacing(3)}px`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:nth-child(2n)': {
      backgroundColor: theme.palette.grey.light
    }
  },
  title: {
    marginTop: 5,
    marginBottom: 5
  },
  titleContainer: {
    width: '25%',
    paddingRight: theme.spacing()
  },
  pieContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 20
  },
  pieInnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    width: 150,
    textAlign: 'center',
    position: 'relative'
  },
  flexStart: {
    alignItems: 'flex-start'
  },
  flexEnd: {
    alignItems: 'flex-end'
  },
  detailContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'absolute',
    top: 15,
    right: 0,
    zIndex: 1
  },
  stackedBarContainer: {
    width: '75%'
  }
});

export default withStyles(styles)(PieGrid);
