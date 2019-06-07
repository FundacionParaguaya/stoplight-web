import React, { useState } from 'react';
import { withStyles, Typography, Grid } from '@material-ui/core';
import { PieChart, Pie, Cell } from 'recharts';
import TitleBar from './TitleBar';
import Container from './Container';
import SummaryStackedBar from './summary/SummaryStackedBar';
import iconAchievement from '../assets/icon_achievement.png';
import iconPriority from '../assets/icon_priority.png';
import { COLORS } from '../theme';

const INDICATORS = {
  Medioambiente: {
    green: 13,
    yellow: 16,
    red: 2,
    skipped: 6,
    priorities: 60,
    achievements: 100
  },
  Basura: {
    green: 3,
    yellow: 23,
    red: 22,
    skipped: 2,
    priorities: 60,
    achievements: 100
  },
  Agua: {
    green: 13,
    yellow: 6,
    red: 25,
    skipped: 2,
    priorities: 60,
    achievements: 100
  },
  'Destino del desagüe': {
    green: 3,
    yellow: 16,
    red: 25,
    skipped: 1,
    priorities: 60,
    achievements: 100
  },
  'Acceso a la salud': {
    green: 13,
    yellow: 10,
    red: 25,
    skipped: 6,
    priorities: 60,
    achievements: 100
  },
  Alimentación: {
    green: 13,
    yellow: 12,
    red: 25,
    skipped: 6,
    priorities: 20,
    achievements: 100
  },
  Higiene: {
    green: 13,
    yellow: 16,
    red: 21,
    skipped: 1,
    priorities: 60,
    achievements: 100
  },
  'Salud Sexual': {
    green: 13,
    yellow: 6,
    red: 25,
    skipped: 6,
    priorities: 60,
    achievements: 100
  },
  'Dientes Sanos': {
    green: 13,
    yellow: 16,
    red: 5,
    skipped: 6,
    priorities: 60,
    achievements: 100
  },
  Vista: {
    green: 1,
    yellow: 16,
    red: 25,
    skipped: 6,
    priorities: 60,
    achievements: 100
  },
  'Consumo Problemático': {
    green: 13,
    yellow: 16,
    red: 25,
    skipped: 6,
    priorities: 60,
    achievements: 100
  }
};

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

const Indicators = withStyles(styles)(({ classes, type }) => {
  return (
    <Grid container>
      {Object.keys(INDICATORS).map((elem, index) => {
        return (
          <React.Fragment key={elem}>
            {type === BAR && (
              <Grid item xs={12} key={elem} className={classes.barContainer}>
                <Typography variant="subtitle1" className={classes.title}>
                  {elem}
                </Typography>
                <SummaryStackedBar
                  greenIndicatorCount={INDICATORS[elem].green}
                  yellowIndicatorCount={INDICATORS[elem].yellow}
                  redIndicatorCount={INDICATORS[elem].red}
                  skippedIndicatorCount={INDICATORS[elem].skipped}
                />
              </Grid>
            )}
            {type === PIE && (
              <Grid
                item
                xs={4}
                key={`donut${elem}`}
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
                    greenIndicatorCount={INDICATORS[elem].green}
                    yellowIndicatorCount={INDICATORS[elem].yellow}
                    redIndicatorCount={INDICATORS[elem].red}
                    skippedIndicatorCount={INDICATORS[elem].skipped}
                  />
                  <Typography variant="subtitle1" className={classes.title}>
                    {elem}
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

const IndicatorsVisualisation = ({ classes }) => {
  const [indicatorsType, setIndicatorsType] = useState(PIE);

  return (
    <div>
      <TitleBar title="Indicators Visualisation" />
      <Container>
        <div className={classes.iconsContainer}>
          <i
            className={`material-icons ${
              indicatorsType === PIE ? classes.iconActive : null
            } ${classes.icon}`}
            onClick={() => setIndicatorsType(PIE)}
          >
            trip_origin
          </i>
          <i
            className={`material-icons ${
              indicatorsType === BAR ? classes.iconActive : null
            } ${classes.icon}`}
            onClick={() => setIndicatorsType(BAR)}
          >
            view_headline
          </i>
        </div>
        <Indicators type={indicatorsType} />
      </Container>
    </div>
  );
};

export default withStyles(styles)(IndicatorsVisualisation);
