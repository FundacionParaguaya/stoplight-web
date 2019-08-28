import React, { useEffect, useState, useReducer } from 'react';
import { Typography, CircularProgress, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { isArray, camelCase } from 'lodash';
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
  ACTIVITY_FEED,
  INDICATORS,
  DIMENSIONS,
  OVERVIEW,
  ECONOMICS,
  CHART,
  LOADING,
  START_LOADING
} from '../utils/types';
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

const getData = data => (data.data && data.data.data ? data.data.data : null);

const LoadingContainer = () => (
  <div style={{ height: 300, margin: 'auto', display: 'flex' }}>
    <CircularProgress style={{ margin: 'auto' }} />
  </div>
);

// Camel case LOADING object and set to true
const initialLoading = Object.fromEntries(
  Object.entries(LOADING).map(([key]) => [camelCase(key), true])
);

const reducer = (state, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        ...initialLoading
      };
    default:
      // Camel case the type and assign the payload
      return { ...state, [camelCase(action.type)]: action.payload };
  }
};

const Dashboard = ({ classes, user, t }) => {
  const [state, dispatch] = useReducer(reducer, {});
  const [loading, dispatchLoading] = useReducer(reducer, initialLoading);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Clearing selected organizations when the hub filter changes
  useEffect(() => {
    setSelectedOrganizations([]);
  }, [selectedHub]);

  useEffect(() => {
    getFamilies(user)
      .then(data => {
        const { feed } = getData(data);
        dispatch({ type: ACTIVITY_FEED, payload: feed });
      })
      .finally(() => dispatchLoading({ type: ACTIVITY_FEED, payload: false }));
  }, [user]);

  useEffect(() => {
    dispatchLoading({ type: START_LOADING });

    const sanitizedOrganizations = selectedOrganizations.map(
      ({ value }) => value
    );
    const hubId = selectedHub && selectedHub.value ? selectedHub.value : null;
    getDimensionIndicators(
      user,
      hubId,
      (selectedOrganizations || []).map(o => o.value),
      fromDate,
      toDate
    )
      .then(data => {
        const { dimensionIndicators } = getData(data);
        let indicatorsArray = [];
        dimensionIndicators.forEach(({ indicators: ind }) => {
          if (isArray(ind)) {
            indicatorsArray = [...indicatorsArray, ...ind];
          }
        });

        dispatch({ type: INDICATORS, payload: indicatorsArray });
        dispatch({ type: DIMENSIONS, payload: dimensionIndicators });
      })
      .finally(() => dispatchLoading({ type: DIMENSIONS, payload: false }));

    getOverviewBlock(user, hubId, fromDate, toDate, sanitizedOrganizations)
      .then(data => {
        const { blockOverview } = getData(data);

        dispatch({ type: OVERVIEW, payload: blockOverview });
      })
      .finally(() => dispatchLoading({ type: OVERVIEW, payload: false }));

    getEconomicOverview(user, hubId, fromDate, toDate, sanitizedOrganizations)
      .then(data => {
        const { economicOverview } = getData(data);

        dispatch({ type: ECONOMICS, payload: economicOverview });
      })
      .finally(() => dispatchLoading({ type: ECONOMICS, payload: false }));

    getOperationsOverview(user, hubId, fromDate, toDate, sanitizedOrganizations)
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

          dispatch({ type: CHART, payload: chartData });
        } else {
          dispatch({ type: CHART, payload: null });
        }
      })
      .finally(() => dispatchLoading({ type: CHART, payload: false }));
  }, [user, selectedHub, selectedOrganizations, fromDate, toDate]);

  return (
    <Container variant="fluid" className={classes.greyBackground}>
      {/* Tite bar */}
      <Container className={classes.titleBar}>
        <div className={classes.ballsContainer}>
          <img src={ballstoit} className={classes.titleBalls} alt="Balls" />
        </div>
        <Typography variant="h4">
          {t('views.dashboard.welcome').replace('$n', user.username)}
        </Typography>
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
      </Container>

      {/* Operations */}
      <Container className={classes.operations} variant="fluid">
        <Container className={classes.operationsInner}>
          <div className={classes.chartContainer}>
            <Typography variant="h5">{t('views.operations')}</Typography>
            <Box mt={3} />
            {loading.chart && <LoadingContainer />}
            {!loading.chart && (
              <GreenLineChart width="100%" height={300} data={state.chart} />
            )}
          </div>
          <div className={classes.feedContainer}>
            <Typography variant="h5">
              {t('views.dashboard.latestActivity')}
            </Typography>
            <Box mt={3} />
            {loading.activityFeed && <LoadingContainer />}
            {!loading.activityFeed && (
              <ActivityFeed
                data={state.activityFeed}
                width="100%"
                height={300}
              />
            )}
          </div>
        </Container>
      </Container>

      {/* Social Economics */}
      <Container className={classes.socialEconomics} variant="fluid">
        <Container className={classes.containerInnerSocial}>
          {loading.economics && <LoadingContainer />}
          {!loading.economics && (
            <FamilyOverviewBlock
              familiesCount={state.economics.familiesCount}
              peopleCount={state.economics.peopleCount}
              noPadding
              width="30%"
              includeEconomics
            />
          )}
          <div className={classes.spacingHelper} />
          {loading.overview && <LoadingContainer />}
          {!loading.overview && (
            <OverviewBlock data={state.overview} width="70%" />
          )}
        </Container>
      </Container>

      {/* Dimensions */}
      <Container className={classes.whiteContainer} variant="fluid">
        <Container>
          <DimensionsVisualisation
            data={[...(state.dimensions || [])].sort((a, b) =>
              a.dimension.toLowerCase().localeCompare(b.dimension.toLowerCase())
            )}
            loading={loading.dimensions}
          />
        </Container>
      </Container>

      {/* Indicators */}
      <Container className={classes.whiteContainer} variant="fluid">
        <Container>
          <IndicatorsVisualisation
            data={[...(state.indicators || [])].sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )}
            loading={loading.dimensions}
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
    marginBottom: theme.spacing(5)
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
