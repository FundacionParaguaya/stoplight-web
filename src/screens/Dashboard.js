import { Box, CircularProgress, Grid, Typography } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HistoryIcon from '@material-ui/icons/History';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/styles';
import { isArray } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Accordion, AccordionItem } from 'react-sanfona';
import {
  getDimensionIndicators,
  getOverviewBlock,
  getEconomicOverview,
  getLastestActivity,
  getOperationsOverview,
  getTotalFamilies,
  cancelRequest,
  cancelFilterRequest
} from '../api';
import ballstoit from '../assets/ballstoit.png';
import ActivityFeed from '../components/ActivityFeed';
import Container from '../components/Container';
import DashboardFilters from '../components/DashboardFilters';
import OverviewBlock from '../components/OverviewBlock';
import DimensionsVisualisation from '../components/DimensionsVisualisation';
import GreenLineChart from '../components/GreenLineChart';
import IndicatorsVisualisation from '../components/IndicatorsVisualisation';
import withLayout from '../components/withLayout';
import {
  normalizeDimension,
  ORDERED_DIMENSIONS
} from '../utils/parametric_data';
import { ROLE_HUB_ADMIN, ROLE_SURVEY_USER } from '../utils/role-utils';
import DashboardGeneralData from './dashboard/DashboardGeneralData';
import DashboardOverviewBlock from './dashboard/DashboardOverviewBlock';

const getData = data => (data.data && data.data.data ? data.data.data : null);
const LoadingContainer = () => (
  <div style={{ height: 300, margin: 'auto', display: 'flex' }}>
    <CircularProgress style={{ margin: 'auto' }} />
  </div>
);

const GeneralDataLoadingContainer = () => (
  <div style={{ height: 120, margin: 'auto', display: 'flex' }}>
    <CircularProgress style={{ margin: 'auto' }} />
  </div>
);

const Dashboard = ({ classes, user, t, i18n: { language }, history }) => {
  const [activityFeed, setActivityFeed] = useState(null);
  const [showFeed, setShowFeed] = useState(false);
  const [overview, setOverview] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const [economic, setEconomic] = useState(null);
  const [selectedOrganizations, setOrganizations] = useState([]);
  const [selectedHub, setSelectedHub] = useState(null);
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [chart, setChart] = useState(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState(0);
  const [snapShotOptions, setSnapShotsOptions] = useState([]);
  const [
    loadingDimensionsIndicators,
    setLoadingDimensionsIndicators
  ] = useState(true);
  const [generalData, setGeneralData] = useState(null);
  const [loadingGeneralData, setLoadingGeneralData] = useState(true);
  const [loadingEconomics, setLoadingEconomics] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);
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

  useEffect(() => {
    return () => {
      cancelRequest();
      cancelFilterRequest();
    };
  }, []);

  // Clearing selected organizations when the hub filter changes
  useEffect(() => {
    setSelectedOrganizations([]);
    setSelectedSurveys([]);
  }, [selectedHub]);

  // Clearing survey filter
  useEffect(() => {
    setSelectedSurveys([]);
    setSelectedProjects([]);
  }, [selectedOrganizations]);

  useEffect(() => {
    getLastestActivity(user, lang)
      .then(data => {
        const { recentActivity } = getData(data);
        setActivityFeed(recentActivity);
      })
      .finally(() => setLoadingFeed(false));
  }, [user, lang]);

  useEffect(() => {
    cancelRequest();
    setLoadingDimensionsIndicators(true);
    setLoadingGeneralData(true);
    setLoadingEconomics(true);
    setLoadingChart(true);
    const sanitizedOrganizations = selectedOrganizations.map(
      ({ value }) => value
    );

    const sanitizedSurveys = (selectedSurveys || []).map(o => o.value);
    const sanitizedProjects = (selectedProjects || []).map(o => o.value);
    const hubId = selectedHub && selectedHub.value ? selectedHub.value : null;
    getDimensionIndicators(
      user,
      hubId,
      (selectedOrganizations || []).map(o => o.value),
      sanitizedSurveys,
      sanitizedProjects,
      fromDate,
      toDate,
      selectedSnapshot,
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
        setIndicators(indicatorsArray);

        // We sort the array against a static ORDERED_DIMENSIONS order
        const sortedDimensions = dimensionIndicators;
        ORDERED_DIMENSIONS.forEach(item =>
          sortedDimensions.sort(
            ({ dimension }) => -(normalizeDimension(dimension) === item)
          )
        );

        setDimensions(sortedDimensions);
        setLoadingDimensionsIndicators(false);
      })
      .catch(e => {});

    getTotalFamilies(
      user,
      hubId,
      sanitizedOrganizations,
      sanitizedSurveys,
      sanitizedProjects,
      fromDate,
      toDate,
      selectedSnapshot,
      lang
    )
      .then(data => {
        const totalFamilies = data.data.data
          ? data.data.data.totalFamilies
          : null;
        setGeneralData(totalFamilies);
        setLoadingGeneralData(false);
      })
      .catch(e => {});

    getOverviewBlock(
      user,
      hubId,
      fromDate,
      toDate,
      sanitizedOrganizations,
      sanitizedSurveys,
      sanitizedProjects,
      selectedSnapshot,
      lang
    )
      .then(data => {
        const { blockOverview } = getData(data);
        setOverview(blockOverview);
        setLoadingOverview(false);
      })
      .catch(e => {});

    getEconomicOverview(
      user,
      hubId,
      fromDate,
      toDate,
      sanitizedOrganizations,
      sanitizedSurveys,
      sanitizedProjects,
      selectedSnapshot,
      lang
    )
      .then(data => {
        const { economicOverview } = getData(data);
        let otherGenders = economicOverview.genders.others;
        let otherGendersCount = 0;
        let otherTooltipText = '';
        for (const gender in otherGenders) {
          otherGendersCount += otherGenders[gender];
          otherTooltipText =
            otherTooltipText +
            ' - ' +
            economicOverview.genders.others[gender] +
            ' ' +
            gender +
            ' \n ';
        }
        economicOverview.peopleByCountries = isArray(
          economicOverview.peopleByCountries
        )
          ? economicOverview.peopleByCountries
              .sort((a, b) => b.people - a.people)
              .slice(0, 3)
          : [];

        economicOverview.genders.otherGendersCount = otherGendersCount;
        economicOverview.genders.otherTooltipText = otherTooltipText;
        setEconomic(economicOverview);
        setLoadingEconomics(false);
      })
      .catch(e => {});

    const transformSurveyByMonth = surveysByMonth => {
      const transformedSurveyByMonth = {};
      for (const key in surveysByMonth) {
        if (surveysByMonth.hasOwnProperty(key)) {
          const snapNumber = key
            .split('-')
            .splice(2, 1)
            .join();
          const itemDate = key
            .split('-')
            .splice(0, 2)
            .join('-');
          if (snapNumber.length < 2) {
            transformedSurveyByMonth[`${itemDate}-0${snapNumber}`] =
              surveysByMonth[key];
          } else {
            transformedSurveyByMonth[`${itemDate}-${snapNumber}`] =
              surveysByMonth[key];
          }
        }
      }
      return transformedSurveyByMonth;
    };

    getOperationsOverview(
      user,
      hubId,
      fromDate,
      toDate,
      sanitizedOrganizations,
      sanitizedSurveys,
      sanitizedProjects,
      lang
    )
      .then(data => {
        const {
          operationsOverview: { surveysByMonth }
        } = getData(data);
        const getTime = date => new Date(date).getTime();

        if (surveysByMonth) {
          const chartData = Object.entries(surveysByMonth)
            .map(([date, surveys]) => {
              const dateData = date
                .split('-')
                .splice(0, 2)
                .join('-');

              const snapShotNumber = date
                .split('-')
                .splice(2, 1)
                .join();

              // Store data from Snapshot number 1 of that month
              if (snapShotNumber === '1') {
                const finalData = {
                  date: moment(date, 'MM-YYYY').format(),
                  first: surveys
                };

                // Create an array of number of retakes by Snapshot number of that month
                // add a second digit to snap number if only has one digit
                // example 04-2021-4 -> 04-2021-04
                let retakesBySnapNumber = [];
                const transformedSurveyByMonth = transformSurveyByMonth(
                  surveysByMonth
                );

                retakesBySnapNumber = Object.entries(transformedSurveyByMonth)
                  .sort()
                  .map(([date, survey]) => {
                    const itemSnapNumber = date
                      .split('-')
                      .splice(2, 1)
                      .join();
                    const itemDate = date
                      .split('-')
                      .splice(0, 2)
                      .join('-');

                    // dont add the snapNumber 01 because is the base line snap
                    if (itemSnapNumber !== '01' && itemDate === dateData) {
                      return { snap_number: itemSnapNumber, value: survey };
                    }
                    return null;
                  })
                  .filter(item => item);

                // sum all retakes of all snapshot number of that month

                const totalRetakes = retakesBySnapNumber.length
                  ? retakesBySnapNumber.reduce((t, { value }) => t + value, 0)
                  : 0;

                // Return data by month
                return {
                  ...finalData,
                  totalRetakes,
                  retakesBySnapNumber,
                  total: finalData.first + totalRetakes
                };
              }
              return null;
            })
            .filter(item => item)
            .sort((a, b) => getTime(a.date) - getTime(b.date));
          const numberOfTakes = calculateNumberOfSnaps(chartData);
          setSnapShotsOptions(numberOfTakes);
          setChart(chartData);
        } else {
          setChart(null);
        }
        setLoadingChart(false);
      })
      .catch(e => {});
  }, [
    user,
    selectedHub,
    selectedOrganizations,
    selectedSurveys,
    selectedProjects,
    selectedSnapshot,
    fromDate,
    toDate,
    lang
  ]);

  const calculateNumberOfSnaps = snapShotsData => {
    let first = 0;
    let maxRetakes = 0;
    snapShotsData.forEach(el => {
      first = el.first && !first ? 1 : 0;
      maxRetakes =
        el.retakesBySnapNumber.length > maxRetakes
          ? el.retakesBySnapNumber.length
          : maxRetakes;
    });
    return first + maxRetakes;
  };

  const getLogoImg = user =>
    (!!user.organization &&
      !!user.organization.logoUrl &&
      user.organization.logoUrl) ||
    (!!user.hub &&
      !!user.hub.logoUrl &&
      user.role === ROLE_HUB_ADMIN &&
      user.hub.logoUrl) ||
    '';

  const animationDuration = 200;

  return (
    <div style={{ display: 'flex' }}>
      <div
        className={classes.feedContainer}
        style={{ width: showFeed ? '22%' : 50 }}
      >
        <Accordion>
          <AccordionItem
            easing="ease"
            duration={animationDuration}
            onExpand={() => setShowFeed(!showFeed)}
            onClose={() => {
              setTimeout(() => setShowFeed(!showFeed), animationDuration + 40);
            }}
            title={
              <Tooltip
                interactive={false}
                id={'activityFeed'}
                title={t('views.dashboard.latestActivity')}
              >
                <div
                  className={classes.moreFilter}
                  style={{
                    left: showFeed ? 283 : ''
                  }}
                >
                  <HistoryIcon className={classes.notificacionIcon} />
                  {!showFeed ? (
                    <ExpandMore className={classes.expandIcon} />
                  ) : (
                    <ExpandLess className={classes.expandIcon} />
                  )}
                </div>
              </Tooltip>
            }
          >
            <div
              className={classes.feedContent}
              style={{ position: showFeed ? 'fixed' : null }}
            >
              <Typography variant="h5">
                {t('views.dashboard.latestActivity')}
              </Typography>
              <Box mt={2} />
              {loadingFeed && <LoadingContainer />}
              {!loadingFeed && (
                <ActivityFeed
                  data={activityFeed}
                  width="100%"
                  height="100vh"
                  history={history}
                />
              )}
            </div>
          </AccordionItem>
        </Accordion>
      </div>

      <div className={classes.greyBackground}>
        <Grid
          container
          className={classes.whiteBackground}
          style={{ paddingLeft: showFeed ? '10%' : null }}
        >
          <Grid item md={2} className={classes.logoContainer}>
            {!!getLogoImg(user) && (
              <img
                alt="logo"
                className={classes.img}
                src={getLogoImg(user)}
                style={{ marginRight: showFeed ? 25 : 0 }}
              />
            )}
          </Grid>
          <Grid item md={8}>
            {/* Tite bar */}
            <div className={classes.titleBar}>
              <div className={classes.ballsContainer}>
                <img
                  src={ballstoit}
                  className={classes.titleBalls}
                  alt="Balls"
                />
              </div>
              <Typography variant="h4">
                {t('views.dashboard.welcome').replace('$n', user.name)}
              </Typography>

              <DashboardFilters
                organizationsData={selectedOrganizations}
                onChangeOrganization={setSelectedOrganizations}
                surveyData={selectedSurveys}
                hubData={selectedHub}
                projectsData={selectedProjects}
                onChangeHub={setSelectedHub}
                onChangeSurvey={setSelectedSurveys}
                onChangeProjects={setSelectedProjects}
                from={fromDate}
                to={toDate}
                onFromDateChanged={setFromDate}
                onToDateChanged={setToDate}
              />
            </div>
          </Grid>
        </Grid>

        {/* General Data */}
        <Container className={classes.generalData} variant="fluid">
          <Container className={classes.containerGeneralData}>
            {loadingGeneralData && <GeneralDataLoadingContainer />}
            {!loadingGeneralData && <DashboardGeneralData data={generalData} />}
          </Container>
        </Container>

        {/* Operations */}
        <Container className={classes.operations} variant="fluid">
          <Container className={classes.operationsInner}>
            <div className={classes.chartContainer}>
              <Box mt={3} />
              {loadingChart && <LoadingContainer />}
              {!loadingChart && (
                <GreenLineChart
                  isMentor={isMentor}
                  width="100%"
                  height={300}
                  data={chart}
                />
              )}
            </div>
          </Container>
        </Container>

        {/* Social Economics */}
        <Container className={classes.socialEconomics} variant="fluid">
          <Container className={classes.containerInnerSocial}>
            {loadingEconomics && <LoadingContainer />}
            {!loadingEconomics && (
              <DashboardOverviewBlock
                data={economic}
                peopleByCountries={economic.peopleByCountries}
                snapShotOptions={snapShotOptions}
                onFilterChanged={value => setSelectedSnapshot(value)}
                snapShotNumber={selectedSnapshot}
              />
            )}
          </Container>
        </Container>

        {/* Stoplight Overview */}
        <Container className={classes.overview} variant="fluid">
          <Container className={classes.containerInnerSocial}>
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
              data={indicators}
              loading={loadingDimensionsIndicators}
            />
          </Container>
        </Container>
      </div>
    </div>
  );
};

const styles = theme => ({
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120
  },
  img: {
    maxWidth: 180,
    maxHeight: 85,
    marginTop: 48,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0
    }
  },
  titleBar: {
    paddingTop: theme.spacing(8),
    position: 'relative',
    paddingBottom: theme.spacing(5),
    [theme.breakpoints.down('xs')]: {
      paddingTop: 0
    }
  },
  ballsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
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
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('xs')]: {
      width: '85%'
    }
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
    marginBottom: 2,
    [theme.breakpoints.down('xs')]: {
      paddingTop: 0
    }
  },
  operationsInner: {
    display: 'flex'
  },
  chartContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      paddingRight: 20
    }
  },
  feedContainer: {
    position: 'relative',
    maxWidth: 380
  },
  feedContent: {
    width: '100%',
    height: '100vh',
    maxWidth: 340,
    padding: 16,
    paddingRight: 2,
    backgroundColor: theme.palette.background.paper,
    zIndex: 100
  },
  socialEconomics: {
    padding: `${theme.spacing(6)}px 0`,
    backgroundColor: theme.palette.background.default,
    marginBottom: 2,
    [theme.breakpoints.down('sm')]: {
      minHeight: 630
    },
    [theme.breakpoints.down('xs')]: {
      minHeight: 710
    }
  },
  overview: {
    padding: `${theme.spacing(6)}px 0`,
    backgroundColor: theme.palette.background.default,
    marginBottom: 2,
    [theme.breakpoints.down('sm')]: {
      minHeight: 500
    },
    [theme.breakpoints.down('xs')]: {
      minHeight: 710
    }
  },
  generalData: {
    backgroundColor: theme.palette.background.default,
    marginBottom: 2,
    padding: 20,
    marginTop: 2
  },
  containerInnerSocial: {
    minHeight: 250,
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      marginRight: 50
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      justifyContent: 'center',
      width: '100%'
    }
  },
  containerGeneralData: {
    minHeight: 140,
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
    marginBottom: 2
  },
  loadingContainer: {
    backgroundColor: theme.palette.grey.light,
    height: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  moreFilter: {
    display: 'flex',
    alignItems: 'center',
    height: 40,
    cursor: 'pointer',
    padding: theme.spacing(1),
    top: 83,
    zIndex: 101,
    position: 'fixed'
  },
  notificacionIcon: {
    color: theme.palette.primary.dark
  },
  expandIcon: {
    color: theme.palette.primary.dark,
    transform: 'rotate(270deg)'
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(
  withTranslation()(withStyles(styles)(withLayout(Dashboard)))
);
