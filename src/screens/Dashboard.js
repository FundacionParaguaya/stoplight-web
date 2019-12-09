import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import {
  getFamilies,
  getDimensionIndicators,
  getEconomicOverview,
  getOverviewBlock,
  getOperationsOverview
} from '../api';
import {
  ORDERED_DIMENSIONS,
  normalizeDimension
} from '../utils/parametric_data';
import ballstoit from '../assets/ballstoit.png';
import withLayout from '../components/withLayout';
import Container from '../components/Container';
import GreenLineChart from '../components/GreenLineChart';
import ActivityFeed from '../components/ActivityFeed';
import FamilyOverviewBlock from '../components/FamiliesOverviewBlock';
import OverviewBlock from '../components/OverviewBlock';
import DimensionsVisualisation from '../components/DimensionsVisualisation';
import IndicatorsVisualisation from '../components/IndicatorsVisualisation';
import DashboardFilters from '../components/DashboardFilters';
import { ROLE_SURVEY_USER } from '../utils/role-utils';

const getData = data => (data.data && data.data.data ? data.data.data : null);

const LoadingContainer = () => (
  <div style={{ height: 300, margin: 'auto', display: 'flex' }}>
    <CircularProgress style={{ margin: 'auto' }} />
  </div>
);

const Dashboard = ({ classes, user, t, i18n: { language } }) => {
  const [activityFeed, setActivityFeed] = useState(null);
  const [overview, setOverview] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [economic, setEconomic] = useState(null);
  const [selectedOrganizations, setOrganizations] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [chart, setChart] = useState(null);
  const [
    loadingDimensionsIndicators,
    setLoadingDimensionsIndicators
  ] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingEconomics, setLoadingEconomics] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  // TODO: If we have more conditions make an Authorize component
  const { role } = user;
  const isMentor = role === ROLE_SURVEY_USER;
  const lang = language;
  const setSelectedOrganizations = (selected, allOrganizations) => {
    if (selected.some(org => org.value === 'ALL')) {
      setOrganizations(allOrganizations);
    } else {
      setOrganizations(selected);
    }
  };

  // Clearing selected organizations when the hub filter changes
  useEffect(() => {
    setSelectedOrganizations([]);
  }, [selectedHub]);

  useEffect(() => {
    getFamilies(user, lang)
      .then(data => {
        const { feed } = getData(data);
        setActivityFeed(feed);
      })
      .finally(() => setLoadingFeed(false));
  }, [user, lang]);

  useEffect(() => {
    setLoadingDimensionsIndicators(true);
    setLoadingOverview(true);
    setLoadingEconomics(true);
    setLoadingChart(true);
    const sanitizedOrganizations = selectedOrganizations.map(
      ({ value }) => value
    );
    const hubId = selectedHub && selectedHub.value ? selectedHub.value : null;
    getDimensionIndicators(
      user,
      hubId,
      (selectedOrganizations || []).map(o => o.value),
      fromDate,
      toDate,
      lang
    )
      .then(data => {
        const { dimensionIndicators } = getData(data);
        let indicatorsArray = [];
        dimensionIndicators.forEach(({ indicators: ind }) => {
          if (isArray(ind)) {
            indicatorsArray = [...indicatorsArray, ...ind];
          }
        });
        console.log(indicatorsArray);
        setIndicators(indicatorsArray);

        // We sort the array against a static ORDERED_DIMENSIONS order
        const sortedDimensions = dimensionIndicators;
        ORDERED_DIMENSIONS.forEach(item =>
          sortedDimensions.sort(
            ({ dimension }) => -(normalizeDimension(dimension) === item)
          )
        );

        setDimensions(sortedDimensions);
      })
      .finally(() => setLoadingDimensionsIndicators(false));

    getOverviewBlock(
      user,
      hubId,
      fromDate,
      toDate,
      sanitizedOrganizations,
      lang
    )
      .then(data => {
        const { blockOverview } = getData(data);
        setOverview(blockOverview);
      })
      .finally(() => setLoadingOverview(false));

    getEconomicOverview(
      user,
      hubId,
      fromDate,
      toDate,
      sanitizedOrganizations,
      lang
    )
      .then(data => {
        const { economicOverview } = getData(data);
        setEconomic(economicOverview);
      })
      .finally(() => setLoadingEconomics(false));

    getOperationsOverview(
      user,
      hubId,
      fromDate,
      toDate,
      sanitizedOrganizations,
      lang
    )
      .then(data => {
        const {
          operationsOverview: { surveysByMonth }
        } = getData(data);
        const getTime = date => new Date(date).getTime();

        if (surveysByMonth) {
          const chartData = Object.entries(surveysByMonth)
            .map(([date, surveys]) => ({
              date: moment(date, 'MM-YYYY').format(),
              surveys
            }))
            .sort((a, b) => getTime(a.date) - getTime(b.date));

          setChart(chartData);
        } else {
          setChart(null);
        }
      })
      .finally(() => setLoadingChart(false));
  }, [user, selectedHub, selectedOrganizations, fromDate, toDate, lang]);

  return (
    <Container variant="fluid" className={classes.greyBackground}>
      {/* Tite bar */}
      <Container
        className={classes.titleBar}
        style={{ overflow: isMentor ? 'hidden' : null }}
      >
        <div className={classes.ballsContainer}>
          <img src={ballstoit} className={classes.titleBalls} alt="Balls" />
        </div>
        <Typography variant="h4">
          {t('views.dashboard.welcome').replace('$n', user.username)}
        </Typography>
        {!isMentor && (
          <DashboardFilters
            organizationsData={selectedOrganizations}
            onChangeOrganization={setSelectedOrganizations}
            hubData={selectedHub}
            onChangeHub={setSelectedHub}
            from={fromDate}
            to={toDate}
            onFromDateChanged={setFromDate}
            onToDateChanged={setToDate}
          />
        )}
      </Container>

      {/* Operations */}
      <Container className={classes.operations} variant="fluid">
        <Container className={classes.operationsInner}>
          <div className={classes.chartContainer}>
            <Typography variant="h5">
              {isMentor
                ? t('views.dashboard.yourProgress')
                : t('views.operations')}
            </Typography>
            <Box mt={3} />
            {loadingChart && <LoadingContainer />}
            {!loadingChart && (
              <GreenLineChart width="100%" height={300} data={chart} />
            )}
          </div>
          <div className={classes.feedContainer}>
            <Typography variant="h5">
              {t('views.dashboard.latestActivity')}
            </Typography>
            <Box mt={3} />
            {loadingFeed && <LoadingContainer />}
            {!loadingFeed && (
              <ActivityFeed data={activityFeed} width="100%" height={300} />
            )}
          </div>
        </Container>
      </Container>

      {/* Social Economics */}
      <Container className={classes.socialEconomics} variant="fluid">
        <Container className={classes.containerInnerSocial}>
          {loadingEconomics && <LoadingContainer />}
          {!loadingEconomics && (
            <FamilyOverviewBlock
              familiesCount={economic.familiesCount}
              peopleCount={economic.peopleCount}
              noPadding
              width="30%"
              includeEconomics
            />
          )}
          <div className={classes.spacingHelper} />
          {loadingOverview && <LoadingContainer />}
          {!loadingOverview && <OverviewBlock data={overview} width="70%" />}
        </Container>
      </Container>

      {/* Dimensions */}
      {!isMentor && (
        <Container className={classes.whiteContainer} variant="fluid">
          <Container>
            <DimensionsVisualisation
              data={dimensions}
              loading={loadingDimensionsIndicators}
            />
          </Container>
        </Container>
      )}

      {/* Indicators */}
      <Container className={classes.whiteContainer} variant="fluid">
        <Container>
          <IndicatorsVisualisation
            /* data={[...(indicators || [])].sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )}*/
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
    paddingTop: theme.spacing(8),
    position: 'relative',
    paddingBottom: theme.spacing(5)
  },
  ballsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    zIndex: 0
  },
  titleBalls: {
    position: 'relative',
    top: '10%',
    right: '25%',
    width: '90%',
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
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
  operationsInner: {
    display: 'flex'
  },
  chartContainer: {
    width: '65%'
  },
  feedContainer: {
    width: '35%'
  },
  socialEconomics: {
    padding: `${theme.spacing(6)}px 0`,
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(5)
  },
  containerInnerSocial: {
    minHeight: 250,
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'center',
      width: '100%'
    }
  },
  spacingHelper: {
    [theme.breakpoints.down('xs')]: {
      height: theme.spacing(5),
      width: '100%'
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
