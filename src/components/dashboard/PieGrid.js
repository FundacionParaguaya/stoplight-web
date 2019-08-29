import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { withTranslation } from 'react-i18next';
import CountDetail from '../CountDetail';
import CustomTooltip from '../CustomTooltip';
import { COLORS } from '../../theme';

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

const IndicatorsDonut = withTranslation()(
  withStyles(donutStyles)(
    ({
      redIndicatorCount,
      yellowIndicatorCount,
      greenIndicatorCount,
      skippedIndicatorCount,
      icon,
      dimension,
      classes,
      t
    }) => {
      const data = [
        { name: 'red', value: redIndicatorCount },
        { name: 'yellow', value: yellowIndicatorCount },
        { name: 'green', value: greenIndicatorCount },
        { name: 'skipped', value: skippedIndicatorCount }
      ];

      return (
        <div className={classes.container}>
          {icon && <img src={icon} alt={dimension} className={classes.icon} />}
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
                  format={({ value, name }) =>
                    `${value} ${t(`views.dashboard.${name}`)}`
                  }
                />
              }
            />
          </PieChart>
        </div>
      );
    }
  )
);

const parseStoplights = stoplights => {
  const getByColor = i =>
    stoplights.find(s => s.color === i)
      ? stoplights.find(s => s.color === i).count
      : 0;

  const green = getByColor(3);
  const yellow = getByColor(2);
  const red = getByColor(1);
  const skipped = getByColor(0);

  return [green, yellow, red, skipped];
};

const PieGrid = ({ classes, items }) => {
  return (
    <Grid container>
      {items.map(
        ({ stoplights, name, dimension, icon, priorities, achievements }) => {
          const [green, yellow, red, skipped] = parseStoplights(stoplights);

          return (
            <Grid
              item
              xs={4}
              md={3}
              key={`donut${name || dimension}`}
              className={classes.pieContainer}
            >
              <div className={classes.pieInnerContainer}>
                <div className={classes.detailContainer}>
                  {priorities > 0 && (
                    <CountDetail border count={priorities} type="priority" />
                  )}
                  {achievements > 0 && (
                    <CountDetail
                      border
                      count={achievements}
                      type="achievement"
                    />
                  )}
                </div>
                <IndicatorsDonut
                  greenIndicatorCount={green}
                  yellowIndicatorCount={yellow}
                  redIndicatorCount={red}
                  skippedIndicatorCount={skipped}
                  icon={icon}
                  dimension={dimension}
                />
                <Typography variant="subtitle2" className={classes.title}>
                  {name || dimension}
                </Typography>
              </div>
            </Grid>
          );
        }
      )}
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
    width: 200,
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
    right: 25,
    zIndex: 1,
    pointerEvents: 'none'
  },
  stackedBarContainer: {
    width: '75%'
  }
});

export default withStyles(styles)(PieGrid);
