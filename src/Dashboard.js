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
// import OrganizationsFilter from './components/OrganizationsFilter';
// import DateRangeFilter from './components/DateRangeFilter';
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
  const [feed, setFeed] = useState(null);
  const [overview, setOverview] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [economic, setEconomic] = useState(null);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const [
    loadingDimensionsIndicators,
    setLoadingDimensionsIndicators
  ] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingEconomics, setLoadingEconomics] = useState(true);
  const theme = useTheme();
  useEffect(() => {
    getFamilies(user).then(families => setFeed(families.data.splice(0, 25)));
  }, [user]);

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
    <Container variant="fluid" className={classes.container}>
      <Container className={classes.titleBar} variant="fluid">
        <Typography variant="h4" className={classes.titleLabel}>
          {t('general.welcome').replace('$n', capitalize(user.username))}
        </Typography>
        {/* <div className={classes.filtersContainer}>
          <OrganizationsFilter
            data={selectedOrganizations}
            onChange={setSelectedOrganizations}
          />
          <div style={{ marginLeft: '80px' }}>
            <DateRangeFilter />
          </div>
        </div> */}
        <DashboardFilters
          organizationsData={selectedOrganizations}
          onChangeOrganization={setSelectedOrganizations}
        />
      </Container>
      <Container className={classes.operations} variant="fluid">
        <Typography variant="h5">{t('views.operations')}</Typography>
        <Box mt={5} />
        {!feed && (
          <div className={classes.loadingContainer}>
            <CircularProgress
              size={50}
              thickness={2}
              style={{ color: theme.palette.grey.main }}
            />
          </div>
        )}
        {feed && chartData && (
          <div className={classes.operationsContainer}>
            <GreenLineChart width="65%" height={220} data={chartData} />
            <ActivityFeed data={feed} width="35%" height={300} />
          </div>
        )}
      </Container>
      <Container className={classes.socialEconomics} variant="fluid">
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
            padding={0}
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
      <Container className={classes.whiteContainer} variant="fluid">
        <DimensionsVisualisation
          data={dimensions}
          loading={loadingDimensionsIndicators}
        />
      </Container>
      <Container className={classes.whiteContainer} variant="fluid">
        <IndicatorsVisualisation
          data={indicators}
          loading={loadingDimensionsIndicators}
        />
      </Container>
    </Container>
  );
};

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.paper
  },
  titleBar: {
    marginBottom: theme.spacing(5)
  },
  titleLabel: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(6)
  },
  operations: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(6),
    marginBottom: theme.spacing(5)
  },
  operationsContainer: {
    display: 'flex'
  },
  socialEconomics: {
    padding: theme.spacing(6),
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(5),
    display: 'flex',
    justifyContent: 'space-between'
  },
  innerSocial: {
    alignSelf: 'flex-end'
  },
  whiteContainer: {
    padding: theme.spacing(6),
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
