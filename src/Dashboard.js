import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box } from '@material-ui/core';
import { withStyles, useTheme } from '@material-ui/styles';
import { connect } from 'react-redux';
import { isArray, capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';
import {
  getFamilies,
  getDimensionIndicators,
  getEconomicOverview,
  getOverviewBlock
} from './api';
import withLayout from './components/withLayout';
import Container from './components/Container';
import GreenLineChart from './components/GreenLineChart';
import ActivityFeed from './components/ActivityFeed';
import FamilyOverviewBlock from './components/FamiliesOverviewBlock';
import OverviewBlock from './components/OverviewBlock';
import DimensionsVisualisation from './components/DimensionsVisualisation';
import IndicatorsVisualisation from './components/IndicatorsVisualisation';
import DashboardFilters from './components/DashboardFilters';

const chartData = [
  { date: '2019-05-13T00:00', surveys: 750 },
  { date: '2019-01-15T00:00', surveys: 560 },
  { date: '2019-07-16T00:00', surveys: 1280 },
  { date: '2019-08-23T00:00', surveys: 400 },
  { date: '2019-09-04T00:00', surveys: 1400 },
  { date: '2019-10-14T00:00', surveys: 1300 }
];

const getData = data => (data.data && data.data.data ? data.data.data : null);

const Dashboard = ({ classes, user, t }) => {
  const [activityFeed, setActivityFeed] = useState(null);
  const [overview, setOverview] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [economic, setEconomic] = useState(null);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [
    loadingDimensionsIndicators,
    setLoadingDimensionsIndicators
  ] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingEconomics, setLoadingEconomics] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    setLoadingDimensionsIndicators(true);
    setLoadingOverview(true);
    setLoadingEconomics(true);
    getDimensionIndicators(
      user,
      (selectedOrganizations || []).map(o => o.value)
    )
      .then(data => {
        const { dimensionIndicators } = getData(data);
        let indicatorsArray = [];
        dimensionIndicators.forEach(({ indicators: ind }) => {
          if (isArray(ind)) {
            indicatorsArray = [...indicatorsArray, ...ind];
          }
        });
        setIndicators(indicatorsArray);
        setDimensions(dimensionIndicators);
      })
      .finally(() => setLoadingDimensionsIndicators(false));
    getFamilies(user)
      .then(data => {
        const { feed } = getData(data);
        setActivityFeed(feed);
      })
      .finally(() => setLoadingFeed(false));

    // TODO add orgs info in the following 2 api requests
    getOverviewBlock(user)
      .then(data => {
        const { blockOverview } = getData(data);
        setOverview(blockOverview);
      })
      .finally(() => setLoadingOverview(false));
    getEconomicOverview(user)
      .then(data => {
        const { economicOverview } = getData(data);
        setEconomic(economicOverview);
      })
      .finally(() => setLoadingEconomics(false));
  }, [user, selectedOrganizations]);

  return (
    <Container variant="fluid" className={classes.greyBackground}>
      {/* Tite bar */}
      <Container className={classes.titleBar}>
        <Typography variant="h4">
          {t('general.welcome').replace('$n', capitalize(user.username))}
        </Typography>
      </Container>

      {/* Dashboard Filters */}
      <Container>
        <DashboardFilters
          organizationsData={selectedOrganizations}
          onChangeOrganization={setSelectedOrganizations}
          from={fromDate}
          to={toDate}
          onFromDateChanged={setFromDate}
          onToDateChanged={setToDate}
        />
      </Container>

      {/* Operations */}
      <Container className={classes.operations} variant="fluid">
        <Container>
          <Typography variant="h5">{t('views.operations')}</Typography>
          <Box mt={5} />
          {!activityFeed && (
            <div className={classes.loadingContainer}>
              <CircularProgress
                size={50}
                thickness={2}
                style={{ color: theme.palette.grey.main }}
              />
            </div>
          )}
          {activityFeed && chartData && (
            <div className={classes.operationsContainer}>
              <GreenLineChart width="65%" height={300} data={chartData} />
              <ActivityFeed data={activityFeed} width="35%" height={300} />
            </div>
          )}
        </Container>
      </Container>

      {/* Social Economics */}
      <Container className={classes.socialEconomics} variant="fluid">
        <Container className={classes.containerInnerSocial}>
          {(loadingOverview || loadingEconomics) && (
            <div className={classes.loadingContainer}>
              <CircularProgress
                size={50}
                thickness={2}
                style={{ color: theme.palette.grey.main }}
              />
            </div>
          )}
          {economic && (
            <FamilyOverviewBlock
              familiesCount={economic.familiesCount}
              peopleCount={economic.peopleCount}
              style={{ padding: 0, marginRight: 60 }}
              includeEconomics
            />
          )}
          {overview && (
            <div className={classes.innerSocial}>
              <Typography variant="h5">
                {t('views.familiesOverviewBlock.overview')}
              </Typography>
              <OverviewBlock data={overview} />
            </div>
          )}
        </Container>
      </Container>

      {/* Dimensions */}
      <Container className={classes.whiteContainer} variant="fluid">
        <Container>
          <DimensionsVisualisation
            data={dimensions}
            loading={loadingDimensionsIndicators}
          />
        </Container>
      </Container>

      {/* Indicators */}
      <Container className={classes.whiteContainer} variant="fluid">
        <Container>
          <IndicatorsVisualisation
            data={indicators}
            loading={loadingDimensionsIndicators}
          />
        </Container>
      </Container>
    </Container>
  );
};

const styles = theme => ({
  titleBar: {
    paddingTop: theme.spacing(6)
  },
  greyBackground: {
    backgroundColor: theme.palette.background.paper
  },
  whiteBackground: {
    backgroundColor: theme.palette.background.default
  },
  titleLabel: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(5)
  },
  operations: {
    padding: `${theme.spacing(5)}px 0`,
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(5)
  },
  operationsContainer: {
    display: 'flex'
  },
  socialEconomics: {
    padding: `${theme.spacing(6)}px 0`,
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(5)
  },
  containerInnerSocial: {
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  whiteContainer: {
    padding: `${theme.spacing(6)}px 0`,
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(5)
  },
  loadingContainer: {
    backgroundColor: theme.palette.grey.light,
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(
  withTranslation()(withStyles(styles)(withLayout(Dashboard)))
);
