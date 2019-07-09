import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import Container from '../components/Container';
import IndicatorsVisualisation from '../components/IndicatorsVisualisation';
import ScreenTitleBar from '../components/ScreenTitleBar';
import withLayout from '../components/withLayout';
import Divider from '../components/Divider';
import Dimensions from '../components/Dimensions';
import BottomSpacer from '../components/BottomSpacer';
import OverviewBlock from '../components/OverviewBlock';
import { getFamilies, getDimensionIndicators } from '../api';
import ActivityFeed from '../components/ActivityFeed';
import GreenLineChart from '../components/GreenLineChart';

const chartData = [
  { date: '2019-05-13T00:00', surveys: 750 },
  { date: '2019-01-15T00:00', surveys: 560 },
  { date: '2019-07-16T00:00', surveys: 1280 },
  { date: '2019-08-23T00:00', surveys: 400 },
  { date: '2019-09-04T00:00', surveys: 1400 },
  { date: '2019-10-14T00:00', surveys: 1300 }
];

const Analytics = ({ classes, t, user }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [dimensions, setDimensions] = useState([]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 0);
    getFamilies(user).then(families => setData(families.data.splice(0, 25)));
    getDimensionIndicators(user).then(
      ({
        data: {
          data: { dimensionIndicators }
        }
      }) => {
        let indicatorsArray = [];
        for (let i = 0; i <= dimensionIndicators.length - 1; i += 1) {
          if (isArray(dimensionIndicators[i].indicators)) {
            indicatorsArray = [
              ...indicatorsArray,
              ...dimensionIndicators[i].indicators
            ];
          }
        }
        setIndicators(indicatorsArray);
        setDimensions(dimensionIndicators);
      }
    );
  }, [user]);
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
              <Dimensions data={dimensions} />
            </Container>
          </div>
          <div className={classes.grayContainer}>
            <Divider height="3" />
          </div>
          <div className={classes.whiteContainer}>
            <Container variant="stretch">
              <Typography variant="h5">Indicators</Typography>
              <Divider height={3} />
              <OverviewBlock />
              <IndicatorsVisualisation indicators={indicators} />
              <ActivityFeed data={data} />
              <GreenLineChart data={chartData} />
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
