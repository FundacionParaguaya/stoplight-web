import React, { useState, useEffect } from 'react';
import { withStyles, Typography, Grid, Button } from '@material-ui/core';
import { PieChart, Pie, Cell } from 'recharts';
import { useTransition, animated } from 'react-spring';
import PrimaryButton from './PrimaryButton';
import Divider from './Divider';
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
    borderRadius: '50%',
    boxSizing: 'content-box'
  }
};

const CountDetail = withStyles(countDetailStyles)(
  ({ type, count, classes, border }) => {
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
              style={{ border: border ? '3px solid #fff' : null }}
            />
            <Typography className={classes.count}>
              {count.toString()}
            </Typography>
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
              style={{ border: border ? '3px solid #fff' : null }}
            />
            <Typography className={classes.count}>
              {count.toString()}
            </Typography>
          </div>
        )}
      </>
    );
  }
);

const Indicators = withStyles(styles)(
  ({ classes, type, indicators, fadeIn }) => {
    const transitions = useTransition(type, null, {
      config: { tension: 350, mass: 1, friction: 50 },
      from: { opacity: fadeIn ? 0 : 1 },
      enter: { opacity: 1 },
      leave: { opacity: fadeIn ? 0 : 1 }
    });

    useEffect(() => {});

    return transitions.map(({ item, key, props }) => {
      return (
        <div key={key} style={{ position: 'relative' }}>
          {item === PIE && (
            <animated.div
              style={{ ...props, position: type === BAR ? 'absolute' : null }}
            >
              <Grid container>
                {indicators.map((indicator, index) => {
                  return (
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
                          <CountDetail border count={14} type="achievement" />
                          <CountDetail border count={4} type="priority" />
                        </div>
                        <IndicatorsDonut
                          greenIndicatorCount={indicator.stoplights.green}
                          yellowIndicatorCount={indicator.stoplights.yellow}
                          redIndicatorCount={indicator.stoplights.red}
                          skippedIndicatorCount={indicator.stoplights.skipped}
                        />
                        <Typography
                          variant="subtitle1"
                          className={classes.title}
                        >
                          {indicator.name}
                        </Typography>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </animated.div>
          )}
          {item === BAR && (
            <animated.div
              style={{ ...props, position: type === PIE ? 'absolute' : null }}
            >
              <Grid container>
                {indicators.map(indicator => {
                  return (
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
                  );
                })}
              </Grid>
            </animated.div>
          )}
        </div>
      );
    });
  }
);

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
  const [indicatorsType, setIndicatorsType] = useState(BAR);
  const [count, setCount] = useState(10);

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <Controllers
        type={indicatorsType}
        setIndicatorsType={setIndicatorsType}
      />
      <Indicators
        type={indicatorsType}
        indicators={indicators.slice(0, count)}
      />
      <Divider height={2} />
      {indicators.length > count && (
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={() => setCount(state => state + 10)}
        >
          See more
        </Button>
      )}
    </div>
  );
};

export default withStyles(styles)(IndicatorsVisualisation);
export { CountDetail };
