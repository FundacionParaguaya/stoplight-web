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
  const [indicatorsLoading, setIndicatorsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 0);
    getFamilies(user).then(families => setData(families.data.splice(0, 25)));

    // eslint-disable-next-line func-names
    (async function() {
      const dimensionData = await getDimensionIndicators(user);

      // we verify data exist
      const dimensionIndicators =
        dimensionData.data && dimensionData.data.data
          ? dimensionData.data.data.dimensionIndicators
          : null;

      let indicatorsArray = [];

      // eslint-disable-next-line no-shadow
      dimensionIndicators.forEach(({ indicators }) => {
        if (isArray(indicators)) {
          indicatorsArray = [...indicatorsArray, ...indicators];
        }
      });

      setIndicators(indicatorsArray);
      setDimensions(dimensionIndicators);
      setIndicatorsLoading(Boolean(!dimensionData));
    })();
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
              <IndicatorsVisualisation
                loading={indicatorsLoading}
                indicators={indicators}
              />
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
