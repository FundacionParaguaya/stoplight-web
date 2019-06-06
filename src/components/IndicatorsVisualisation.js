import React, { useState } from 'react';
import { withStyles, Typography, Button, Grid } from '@material-ui/core';
import { PieChart, Pie, Cell } from 'recharts';
import TitleBar from './TitleBar';
import Container from './Container';
import SummaryStackedBar from './summary/SummaryStackedBar';
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
  }
};

const Indicators = withStyles(styles)(({ classes, type }) => {
  return (
    <Grid container>
      {Object.keys(INDICATORS).map(elem => {
        return (
          <>
            {type && (
              <Grid xs={12} key={elem} className={classes.barContainer}>
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
            {!type && (
              <Grid item xs={4} key={elem} className={classes.pieContainer}>
                <IndicatorsDonut
                  greenIndicatorCount={INDICATORS[elem].green}
                  yellowIndicatorCount={INDICATORS[elem].yellow}
                  redIndicatorCount={INDICATORS[elem].red}
                  skippedIndicatorCount={INDICATORS[elem].skipped}
                />
                <Typography variant="subtitle1" className={classes.title}>
                  {elem}
                </Typography>
              </Grid>
            )}
          </>
        );
      })}
    </Grid>
  );
});

const Divider = () => {
  return <div style={{ width: '100%', height: 20 }} />;
};

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

const IndicatorsVisualisation = () => {
  // false bar - true pie
  const [indicatorsType, setIndicatorsType] = useState(false);

  return (
    <div>
      <TitleBar title="Indicators Visualisation" />
      <Container variant="stretch">
        <Divider />
        <Button
          variant="contained"
          onClick={() => setIndicatorsType(!indicatorsType)}
        >
          Pie
        </Button>
        <Divider />
        <Indicators type={indicatorsType} />
      </Container>
    </div>
  );
};

export default IndicatorsVisualisation;
