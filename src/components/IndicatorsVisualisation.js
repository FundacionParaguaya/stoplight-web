import React, { useState } from 'react';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { PieChart, Pie, Cell } from 'recharts';
import SummaryStackedBar from './summary/SummaryStackedBar';
import iconAchievement from '../assets/icon_achievement.png';
import iconPriority from '../assets/icon_priority.png';
import { COLORS } from '../theme';

const styles = {
  barContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  title: {
    marginTop: 5,
    marginBottom: 5
  },
  pieContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
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
  }
};

const INDICATORS_TYPES = ['pie', 'bar'];
const [PIE, BAR] = INDICATORS_TYPES;

const alignByIndex = index => {
  if (index % 3 === 0) return 'flexStart';
  if ((index - 2) % 3 === 0) return 'flexEnd';
  return null;
};

let CountDetail = ({ type, count, classes }) => {
  const [PRIORITY, ACHIEVEMENT] = ['priority', 'achievement'];

  return (
    <>
      {type === PRIORITY && (
        <div className={`${classes.countContainer}`}>
          <img
            src={iconPriority}
            alt="Priority"
            width="18"
            height="18"
            className={classes.icon}
          />
          <Typography className={classes.count}>{count.toString()}</Typography>
        </div>
      )}
      {type === ACHIEVEMENT && (
        <div className={`${classes.countContainer}`}>
          <img
            src={iconAchievement}
            alt="Achievement"
            width="18"
            height="18"
            className={classes.icon}
          />
          <Typography className={classes.count}>{count.toString()}</Typography>
        </div>
      )}
    </>
  );
};

const countDetailStyles = {
  countContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%'
  },
  count: {
    fontSize: 16,
    marginLeft: 5
  },
  icon: {
    border: '3px solid #fff',
    borderRadius: '50%',
    boxSizing: 'content-box'
  }
};

CountDetail = withStyles(countDetailStyles)(CountDetail);

const Indicators = withStyles(styles)(({ classes, type, indicators }) => {
  return (
    <Grid container>
      {indicators.map((indicator, index) => {
        return (
          <React.Fragment key={indicator.name}>
            {type === BAR && (
              <Grid
                item
                xs={12}
                key={indicator.name}
                className={classes.barContainer}
              >
                <Typography variant="subtitle1" className={classes.title}>
                  {indicator.name}
                </Typography>
                <SummaryStackedBar
                  greenIndicatorCount={indicator.stoplights.green}
                  yellowIndicatorCount={indicator.stoplights.yellow}
                  redIndicatorCount={indicator.stoplights.red}
                  skippedIndicatorCount={indicator.stoplights.skipped}
                />
              </Grid>
            )}
            {type === PIE && (
              <Grid
                item
                xs={4}
                key={`donut${indicator.name}`}
                className={`${classes.pieContainer} ${
                  classes[alignByIndex(index)]
                }`}
              >
                <div className={classes.pieInnerContainer}>
                  <div className={classes.detailContainer}>
                    <CountDetail count={14} type="achievement" />
                    <CountDetail count={4} type="priority" />
                  </div>
                  <IndicatorsDonut
                    greenIndicatorCount={indicator.stoplights.green}
                    yellowIndicatorCount={indicator.stoplights.yellow}
                    redIndicatorCount={indicator.stoplights.red}
                    skippedIndicatorCount={indicator.stoplights.skipped}
                  />
                  <Typography variant="subtitle1" className={classes.title}>
                    {indicator.name}
                  </Typography>
                </div>
              </Grid>
            )}
          </React.Fragment>
        );
      })}
    </Grid>
  );
});

const IndicatorsDonut = ({
  redIndicatorCount,
  yellowIndicatorCount,
  greenIndicatorCount,
  skippedIndicatorCount
}) => {
  const data = [
    { name: 'red', value: redIndicatorCount },
    { name: 'yellow', value: yellowIndicatorCount },
    { name: 'green', value: greenIndicatorCount },
    { name: 'skipped', value: skippedIndicatorCount }
  ];

  return (
    <PieChart width={100} height={100}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={25}
        outerRadius={35}
        paddingAngle={0}
        isAnimationActive={false}
      >
        <Cell fill={COLORS.RED} stroke={COLORS.RED} />
        <Cell fill={COLORS.YELLOW} stroke={COLORS.YELLOW} />
        <Cell fill={COLORS.GREEN} stroke={COLORS.GREEN} />
        <Cell fill={COLORS.LIGHT_GREY} stroke={COLORS.LIGHT_GREY} />
      </Pie>
    </PieChart>
  );
};

const controllersStyles = {
  icon: {
    color: '#E5E4E2',
    cursor: 'pointer',
    paddingLeft: 5,
    '&:nth-child(1)': {
      borderRight: '2px solid #E5E4E2',
      paddingRight: 5,
      paddingLeft: 0
    }
  },
  iconsContainer: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconActive: {
    color: '#626262'
  }
};

const Controllers = withStyles(controllersStyles)(
  ({ type, setIndicatorsType, classes }) => {
    return (
      <div className={classes.iconsContainer}>
        <i
          className={`material-icons ${
            type === PIE ? classes.iconActive : null
          } ${classes.icon}`}
          onClick={() => setIndicatorsType(PIE)}
        >
          trip_origin
        </i>
        <i
          className={`material-icons ${
            type === BAR ? classes.iconActive : null
          } ${classes.icon}`}
          onClick={() => setIndicatorsType(BAR)}
        >
          view_headline
        </i>
      </div>
    );
  }
);

const IndicatorsVisualisation = ({ indicators }) => {
  const [indicatorsType, setIndicatorsType] = useState(PIE);

  return (
    <div>
      <Controllers
        type={indicatorsType}
        setIndicatorsType={setIndicatorsType}
      />
      <Indicators type={indicatorsType} indicators={indicators} />
    </div>
  );
};

export default withStyles(styles)(IndicatorsVisualisation);
