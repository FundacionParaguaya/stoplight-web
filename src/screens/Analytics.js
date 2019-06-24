import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import Container from '../components/Container';
import IndicatorsVisualisation from '../components/IndicatorsVisualisation';
import ScreenTitleBar from '../components/ScreenTitleBar';
import withLayout from '../components/withLayout';
import Divider from '../components/Divider';
import Dimensions from '../components/Dimensions';
import BottomSpacer from '../components/BottomSpacer';
import { getFamilies } from '../api';
import ActivityFeed from '../components/ActivityFeed';

const INDICATORS = [
  {
    name: 'Medioambiente',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Basura',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Agua',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Destino del desagüe',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Acceso a la salud',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Alimentación',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 20,
    achievements: 100
  },
  {
    name: 'Higiene',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Salud Sexual',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Dientes Sanos',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Vista',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  },
  {
    name: 'Consumo Problemático',
    stoplights: {
      green: 13,
      yellow: 16,
      red: 25,
      skipped: 6
    },
    priorities: 60,
    achievements: 100
  }
];

const randomized = INDICATORS.map(indicator => ({
  ...indicator,
  stoplights: {
    green: parseInt(Math.random() * 20, 10),
    red: parseInt(Math.random() * 10, 10),
    yellow: parseInt(Math.random() * 20, 10),
    skipped: parseInt(Math.random() * 5, 10)
  }
}));

const fakeData = {
  'Ingreso y Empleo': {
    green: 25,
    yellow: 7,
    red: 15,
    skipped: 10,
    priorities: 520,
    achievements: 33
  },
  'Salud y Medioambiente': {
    green: 21,
    yellow: 12,
    red: 3,
    skipped: 2,
    priorities: 110,
    achievements: 834
  },
  'Vivienda e Infraestructura': {
    green: 13,
    yellow: 16,
    red: 25,
    skipped: 6,
    priorities: 60,
    achievements: 100
  },
  'Organización y Participación': {
    green: 5,
    yellow: 23,
    red: 12,
    skipped: 10,
    priorities: 0,
    achievements: 312
  }
};
Object.keys(fakeData).forEach(
  fd => (fakeData[fd].indicators = { ...fakeData })
);

const Analytics = ({ classes, t, user }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 0);
    getFamilies(user).then(families => setData(families.data.splice(0, 25)));
  }, []);
  return (
    <>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress size={50} thickness={2} />
        </div>
      )}
      {!loading && (
        <>
          <div className={classes.grayContainer}>
            <Container variant="stretch">
              <ScreenTitleBar
                title={t('views.analytics.title')}
                subtitle={t('views.analytics.subtitle')}
                description={t('views.analytics.description')}
                betaBadge
              />
            </Container>
          </div>
          <div className={classes.whiteContainer}>
            <Container variant="stretch">
              <Typography variant="h5">Dimensions</Typography>
              <Divider />
              <Dimensions data={fakeData} />
            </Container>
          </div>
          <div className={classes.grayContainer}>
            <Divider height="3" />
          </div>
          <div className={classes.whiteContainer}>
            <Container variant="stretch">
              <Typography variant="h5">Indicators</Typography>
              <IndicatorsVisualisation indicators={randomized} />
              <ActivityFeed data={data} />
            </Container>
          </div>
          <BottomSpacer />
        </>
      )}
    </>
  );
};
const styles = theme => ({
  grayContainer: {
    backgroundColor: theme.palette.background.paper
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    minHeight: `calc(100vh - ${theme.shape.header} - ${theme.shape.footer})`,
    backgroundColor: theme.palette.background.paper
  },
  whiteContainer: {
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(
  withStyles(styles)(withTranslation()(withLayout(Analytics)))
);
