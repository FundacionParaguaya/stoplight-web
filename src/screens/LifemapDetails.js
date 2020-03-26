import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { Tab, Tabs } from '@material-ui/core';
import Container from '../components/Container';
import chooseLifeMap from '../assets/begin_lifemap.png';
import withLayout from '../components/withLayout';
import { getFamily, getSnapshotsByFamily } from '../api';
import { withSnackbar } from 'notistack';
import NavigationBar from '../components/NavigationBar';
import LifemapDetailsTable from '../components/LifemapDetailsTable';
import DetailsOverview from '../components/DetailsOverview';

const LifemapDetail = ({
  classes,
  user,
  t,
  i18n: { language },
  enqueueSnackbar,
  closeSnackbar,
  history
}) => {
  //export class LifemapDetail extends Component {
  const [family, setFamily] = useState({});
  const [firtsParticipant, setFirtsParticipant] = useState({});
  const [mentor, setMentor] = useState({});
  let { familyId } = useParams();
  const tableRef = useRef();
  const [value, setValue] = useState(1);
  const [snapshot, setSnapshot] = useState([]);
  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    { label: t('views.familyProfile.profile'), link: `/family/${familyId}` },
    { label: t('general.lifeMaps'), link: `/detail/${familyId}` }
  ];

  useEffect(() => {
    getFamily(familyId, user).then(response => {
      let members = response.data.data.familyById.familyMemberDTOList;

      let firtsParticipantMap = members.find(
        element => element.firstParticipant === true
      );

      setFamily(response.data.data.familyById);
      setFirtsParticipant(firtsParticipantMap);

      let mentor = {
        label: response.data.data.familyById.user.username,
        value: response.data.data.familyById.user.userId
      };

      setMentor(mentor);
    });
  }, []);

  const loadData = () => {
    getSnapshotsByFamily(familyId, user).then(response => {
      console.log(response);
    });
    return getFamily(familyId, user).then(response => {
      setSnapshot(
        response.data.data.familyById.snapshotIndicators.indicatorSurveyDataList
      );
      return {
        data:
          response.data.data.familyById.snapshotIndicators
            .indicatorSurveyDataList,
        page: 0,
        totalCount:
          response.data.data.familyById.snapshotIndicators
            .indicatorSurveyDataList.length
      };
    });
  };

  const handleChange = (event, value) => {
    setValue(value);
  };

  const pushIndicator = indicator => {
    let forward = 'skipped-indicator';
    if (indicator.value) {
      forward = indicator.value === 3 ? 'achievement' : 'priority';
    }
    //this.props.history.push(`${forward}/${indicator.key}`);
  };

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <Container variant="stretch" key={1} className={classes.headerContainer}>
        <NavigationBar options={navigationOptions}></NavigationBar>
        <div className={classes.titleContainer}>
          <div className={classes.surveyTopTitle}>
            <img
              src={chooseLifeMap}
              alt="Choose Life Map"
              className={classes.chooseLifeMapImage}
            />
            <Typography variant="h4">{family.name}</Typography>
            {/* Organization Name */}
            <div className={classes.container}>
              <Typography variant="subtitle1" className={classes.label}>
                {t('views.familyProfile.organization')}
              </Typography>
              <span>&nbsp;</span>
              <Typography variant="subtitle1" className={classes.label}>
                {family.organization ? family.organization.name : ''}
              </Typography>
            </div>
          </div>
        </div>
      </Container>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
        variant="fullWidth"
        centered
        scrollButtons="auto"
        classes={{ root: classes.tabsRoot }}
      >
        <Tab
          classes={{ root: classes.tabRoot }}
          label={
            <Typography
              variant="h6"
              style={{ fontSize: 16, fontWeight: 'normal' }}
            >
              {t('views.familiesOverviewBlock.overview')}
            </Typography>
          }
          value={1}
        />

        <Tab
          classes={{ root: classes.tabRoot }}
          label={
            <Typography variant="h6" className={classes.columnHeader}>
              {`${t('views.familyProfile.stoplight')} 1 Mar 3, 2019`}
            </Typography>
          }
          value={2}
        />
      </Tabs>

      {value === 1 && (
        <LifemapDetailsTable
          tableRef={tableRef}
          loadData={loadData}
          numberOfRows={10}
          isLast={true}
        />
      )}
      {value !== 1 && (
        <DetailsOverview
          familyId={familyId}
          snapshot={snapshot}
          pushIndicator={pushIndicator}
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
    textAlign: 'left',
    fontWeight: 500,
    width: 100,
    margin: 'auto'
  },
  tabsRoot: {
    backgroundColor: '#fff',
    paddingLeft: 30,
    paddingRight: 30,
    height: 64,
    position: 'relative',
    zIndex: 1,
    width: '100%',
    '& $div > span': {
      backgroundColor: theme.palette.primary.dark,
      height: 4
    }
  },
  tabRoot: {
    color: '#626262',
    height: 64,
    '&.MuiTab-textColorSecondary.Mui-selected': {
      color: '#626262'
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
