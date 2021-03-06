import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { Tab, Tabs } from '@material-ui/core';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import chooseLifeMap from '../assets/begin_lifemap.png';
import withLayout from '../components/withLayout';
import { getFamily, getSnapshotsByFamily, getSurveyById } from '../api';
import LifemapDetailsTable from '../components/LifemapDetailsTable';
import DetailsOverview from '../components/DetailsOverview';
import { getDateFormatByLocale } from '../utils/date-utils';
import Header from '../components/Header';
import { ROLES_NAMES } from '../utils/role-utils';

const LifemapDetail = ({ classes, user, t, i18n: { language } }) => {
  const { familyId } = useParams();
  const tableRef = useRef();
  const dateFormat = getDateFormatByLocale(language);

  const [family, setFamily] = useState({});
  const [survey, setSurvey] = useState();
  const [value, setValue] = useState(1);
  const [snapshots, setSnapshots] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);

  const [navigationOptions, setNavigationOptions] = useState([]);

  let count = 0;

  useEffect(() => {
    getNavigationOptions(user);
    loadFamilyData();
  }, []);

  const getNavigationOptions = ({ role }) => {
    let options = [];

    if (role === ROLES_NAMES.ROLE_FAMILY_USER) {
      options = [
        { label: t('views.toolbar.my-profile'), link: `/my-profile` },
        { label: t('general.lifeMaps'), link: `/detail/${familyId}` }
      ];
    } else {
      options = [
        { label: t('views.familyProfile.families'), link: '/families' },
        {
          label: t('views.familyProfile.profile'),
          link: `/family/${familyId}`
        },
        { label: t('general.lifeMaps'), link: `/detail/${familyId}` }
      ];
    }

    setNavigationOptions(options);
  };

  const loadFamilyData = () => {
    getFamily(familyId, user).then(response => {
      let familyData = response.data.data.familyById;

      setFamily(familyData);
      getSurveyById(user, familyData.snapshotIndicators.surveyId)
        .then(response => {
          setSurvey(response.data.data.surveyById);
        })
        .catch(e => {
          console.error(e);
        });
    });
  };

  const loadData = () => {
    let data = [];
    return getSnapshotsByFamily(familyId, user).then(response => {
      let snapshotsOverview =
        response.data.data.familySnapshotsOverview.snapshots;
      setSnapshots(snapshotsOverview);
      snapshotsOverview.forEach((snapshot, i) => {
        snapshot.stoplight.forEach(ind => {
          let index = data.findIndex(d => d.codeName === ind.codeName);
          if (index > -1) {
            data[index] = {
              ...data[index],
              values: [...data[index].values, { column: i, ...ind }]
            };
          } else {
            data.push({
              codeName: ind.codeName,
              lifemapName: ind.lifemapName,
              values: [{ column: i, ...ind }]
            });
          }
        });
      });
      setNumberOfRows(data.length);
      return {
        data: data,
        page: 0,
        totalCount: data.length
      };
    });
  };

  const reloadPage = () => {
    setValue(1);
    loadFamilyData();
    loadData();
  };

  const handleChange = (event, value) => {
    setValue(value);
  };

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <Header
        title={family.name}
        subtitle1={t('views.familyProfile.organization').concat(
          family.organization ? family.organization.name : ''
        )}
        imageSource={chooseLifeMap}
        altTextImage="Choose Life Map"
        navigationOptions={navigationOptions}
        titleTextTransform="capitalize"
      />
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        classes={{ root: classes.tabsRoot }}
      >
        <Tab
          key={0}
          style={{ width: `${100 / (snapshots.length + 1)}%` }}
          classes={{ root: classes.tabRoot }}
          label={
            <Typography className={classes.subtitleLabel}>
              {t('views.familiesOverviewBlock.overview')}
            </Typography>
          }
          value={1}
        />

        {snapshots.length > 0 &&
          snapshots.map((snapshot, i) => {
            count += 1;
            return (
              <Tab
                key={count}
                style={{ width: `${100 / (snapshots.length + 1)}%` }}
                classes={{ root: classes.tabRoot }}
                label={
                  <Typography variant="h6" className={classes.columnHeader}>
                    <div style={{ fontWeight: 600, marginBottom: -5 }}>
                      {`${t('views.familyProfile.stoplight')} ${count}`}
                    </div>
                    {`${moment
                      .unix(snapshot.snapshotDate)
                      .utc(true)
                      .format(dateFormat)}`}
                  </Typography>
                }
                value={count + 1}
              />
            );
          })}
      </Tabs>

      {value === 1 && (
        <LifemapDetailsTable
          tableRef={tableRef}
          loadData={loadData}
          numberOfRows={numberOfRows}
          snapshots={snapshots}
        />
      )}
      {value !== 1 && (
        <DetailsOverview
          family={family}
          index={value - 2}
          snapshot={snapshots[value - 2]}
          reloadPage={reloadPage}
          survey={survey}
        />
      )}
    </div>
  );
};

const styles = theme => ({
  mainSurveyContainerBoss: {
    backgroundColor: theme.palette.background.paper
  },
  secundarySurveyContainerBoss: {
    backgroundColor: theme.palette.background.default
  },
  headerContainer: {
    height: 215,
    postition: 'relative'
  },
  chooseLifeMapImage: {
    display: 'block',
    height: 240,
    right: -50,
    position: 'absolute',
    top: -55,
    zIndex: 0,
    objectFit: 'cover',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative'
  },
  surveyTopTitle: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 175,
    zIndex: 1
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  columnHeader: {
    textAlign: 'center',
    margin: 'auto',
    height: 'auto',
    fontSize: 16,
    fontFamily: 'Poppins',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    },
    color: theme.palette.grey.middle,
    textTransform: 'none'
  },
  tabsRoot: {
    minHeight: 100,
    backgroundColor: theme.palette.background.default,
    paddingLeft: '12%',
    paddingRight: '12%',
    position: 'relative',
    zIndex: 1,
    width: '100%',
    '& $div > span': {
      backgroundColor: theme.palette.primary.dark,
      height: 4
    },
    overflowX: 'auto'
  },
  tabRoot: {
    minHeight: 84,
    paddingTop: 25,
    paddingBottom: 13,
    color: theme.typography.h4.color,
    height: 'auto',
    minWidth: 180,
    width: 'auto',
    '&.MuiTab-textColorSecondary.Mui-selected': {
      color: theme.typography.h4.color
    },
    '&.MuiTab-textColorSecondary.MuiTab-fullWidth': {
      borderBottom: `1px solid ${theme.palette.grey.quarter}`
    }
  },
  subtitleLabel: {
    width: 'auto',
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'Poppins',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    },
    color: theme.palette.grey.middle,
    textTransform: 'none'
  }
});

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(
    connect(mapStateToProps)(
      withTranslation()(withLayout(withSnackbar(LifemapDetail)))
    )
  )
);
