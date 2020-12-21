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
import { getFamily, getSnapshotsByFamily } from '../api';
import LifemapDetailsTable from '../components/LifemapDetailsTable';
import DetailsOverview from '../components/DetailsOverview';
import { getDateFormatByLocale } from '../utils/date-utils';
import Header from '../components/Header';

const LifemapDetail = ({ classes, user, t, i18n: { language } }) => {
  // export class LifemapDetail extends Component {
  const [family, setFamily] = useState({});
  const [firstParticipant, setFirstParticipant] = useState({});
  const [mentor, setMentor] = useState({});
  let { familyId } = useParams();
  const tableRef = useRef();
  const [value, setValue] = useState(1);
  const [snapshots, setSnapshots] = useState([]);
  const [numberOfRows, setNumberOfRows] = useState(0);
  const [snapshotsWithStoplight, setSnapshotsWithStoplight] = useState(0);
  let count = 0;
  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    { label: t('views.familyProfile.profile'), link: `/family/${familyId}` },
    { label: t('general.lifeMaps'), link: `/detail/${familyId}` }
  ];
  const dateFormat = getDateFormatByLocale(language);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = () => {
    getFamily(familyId, user).then(response => {
      let members = response.data.data.familyById.familyMemberDTOList;

      let firtsParticipantMap = members.find(
        element => element.firstParticipant === true
      );

      setFamily(response.data.data.familyById);
      setFirstParticipant(firtsParticipantMap);

      let mentor = {
        label: response.data.data.familyById.user.username,
        value: response.data.data.familyById.user.userId
      };

      setMentor(mentor);
    });
  };

  const loadData = () => {
    let data = [];
    return getSnapshotsByFamily(familyId, user).then(response => {
      setSnapshots(response.data.data.familySnapshotsOverview.snapshots);
      setSnapshotsWithStoplight(
        response.data.data.familySnapshotsOverview.snapshots.filter(
          snapshot => snapshot.stoplightSkipped === false
        )
      );
      response.data.data.familySnapshotsOverview.snapshots.forEach(
        (snapshot, i) => {
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
        }
      );
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
          classes={{ root: classes.tabRoot }}
          label={
            <Typography
              variant="h6"
              style={{ fontSize: 16, fontWeight: 500, textTransform: 'none' }}
            >
              {t('views.familiesOverviewBlock.overview')}
            </Typography>
          }
          value={1}
        />

        {snapshots.length > 0 &&
          snapshots.map((snapshot, i) => {
            if (!snapshot.stoplightSkipped) {
              count += 1;
              return (
                <Tab
                  key={count}
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
            }
            return '';
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
          familyId={familyId}
          firstParticipant={firstParticipant}
          family={family}
          mentor={mentor}
          index={value - 2}
          snapshot={snapshotsWithStoplight[value - 2]}
          reloadPage={reloadPage}
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
    textTransform: 'none',
    height: 'auto',
    width: 'auto'
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
