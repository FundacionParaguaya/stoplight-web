import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { updateUser, updateSurvey, updateDraft } from '../redux/actions';
import Container from '../components/Container';
import chooseLifeMap from '../assets/family.png';
import withLayout from '../components/withLayout';
import { getFamily, assignFacilitator } from '../api';
import { withSnackbar } from 'notistack';
import * as _ from 'lodash';
import familyFace from '../assets/face_icon_large.png';
import MailIcon from '@material-ui/icons/Mail';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SummaryDonut from '../components/summary/SummaryDonut';
import SummaryBarChart from '../components/SummaryBarChart';
import CountDetail from '../components/CountDetail';
import Divider from '../components/Divider';
import AllSurveyIndicators from '../components/summary/AllSurveyIndicators';
import { getDateFormatByLocale } from '../utils/date-utils';
import moment from 'moment';
import { getPlatform } from '../utils/role-utils';
import FacilitatorFilter from '../components/FacilitatorFilter';
import Grid from '@material-ui/core/Grid';
import { ROLES_NAMES } from '../utils/role-utils';
import ConfirmationModal from '../components/ConfirmationModal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import NavigationBar from '../components/NavigationBar';
import FamilyPriorities from '../components/FamilyPriorities';

const FamilyProfile = ({
  classes,
  user,
  t,
  i18n: { language },
  enqueueSnackbar,
  closeSnackbar
}) => {
  //export class FamilyProfile extends Component {
  const [family, setFamily] = useState({});
  const [firtsParticipant, setFirtsParticipant] = useState({});
  let { familyId } = useParams();
  const dateFormat = getDateFormatByLocale(language);
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacilitator, setSelectedFacilitator] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    { label: t('views.familyProfile.family'), link: '/family' }
  ];

  const goToFamilyPsp = e => {
    window.location.replace(`${getPlatform(user.env)}/#families/${familyId}`);
  };

  const changeFacilitator = () => {
    console.log('Change facilitator');
    setShowConfirmationModal(true);
  };

  const handleClose = () => {
    setShowConfirmationModal(false);
  };

  const showAdministrationOptions = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_HUB_ADMIN ||
      role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_ROOT ||
      role === ROLES_NAMES.ROLE_PS_TEAM
    );
  };

  const onChangeFacilitator = (value, facilitators) => {
    console.log('Set Facilitator to: ', value);
    setSelectedFacilitator(value);
  };

  const confirmChangeFacilitator = () => {
    //Call api
    assignFacilitator(familyId, selectedFacilitator.value, user)
      .then(response => {
        setShowConfirmationModal(false);
        enqueueSnackbar(t('views.familyProfile.Mentorsuccess'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.familyProfile.mentorError'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });

    //set new facilitator to combo
  };

  useEffect(() => {
    setLoading(true);
    setFacilitators([]);

    getFamily(familyId, user).then(response => {
      let members = response.data.data.familyById.familyMemberDTOList;
      console.log('members', members);
      let firtsParticipantMap = members.find(
        element => element.firstParticipant === true
      );
      console.log('firtsParticipantMap', firtsParticipantMap);
      setFamily(response.data.data.familyById);
      setFirtsParticipant(firtsParticipantMap);
      console.log('Mentor', response.data.data.familyById.user);

      let mentor = {
        label: response.data.data.familyById.user.username,
        value: response.data.data.familyById.user.userId
      };
      setSelectedFacilitator(mentor);
    });
  }, []);

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <Container variant="stretch">
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

      {/* Firts Participant Information */}
      <Container className={classes.basicInfo} variant="fluid">
        <div className={classes.iconBaiconFamilyBorder}>
          <img
            src={familyFace}
            className={classes.iconFamily}
            alt="Family Member"
          />
          {family.familyMemberDTOList && family.familyMemberDTOList.length > 1 && (
            <div className={classes.iconBadgeNumber}>
              <Typography
                variant="h6"
                style={{ fontSize: 9, color: '#6A6A6A', fontWeight: 'bold' }}
              >
                +{family.familyMemberDTOList.length - 1}
              </Typography>
            </div>
          )}
        </div>
      </Container>
      <Container className={classes.basicInfoText} variant="fluid">
        <Typography variant="h5">{family ? family.name : ''}</Typography>
        <div className={classes.horizontalAlign}>
          <MailIcon className={classes.iconGreen} />
          {firtsParticipant && firtsParticipant.email ? (
            <a href={'mailto:' + firtsParticipant.email}>
              <Typography variant="subtitle1" className={classes.labelGreen}>
                {firtsParticipant.email}
              </Typography>
            </a>
          ) : (
            <Typography variant="subtitle1" className={classes.labelGreen}>
              --
            </Typography>
          )}
        </div>
        <div className={classes.horizontalAlign}>
          <PhoneInTalkIcon className={classes.iconGreen} />

          {firtsParticipant && firtsParticipant.phoneNumber ? (
            <a href={'tel:' + firtsParticipant.phoneNumber}>
              <Typography variant="subtitle1" className={classes.labelGreen}>
                {firtsParticipant.phoneNumber}
              </Typography>
            </a>
          ) : (
            <Typography variant="subtitle1" className={classes.labelGreen}>
              --
            </Typography>
          )}
        </div>
        <div className={classes.horizontalAlign}>
          <LocationOnIcon className={classes.iconGray} />
          <Typography variant="subtitle1" className={classes.label}>
            {family && family.country ? family.country.country : '--'}
          </Typography>
        </div>

        <div className={classes.graphContainer}>
          {/* Counting Donut */}
          <div className={classes.donutContainer}>
            <Typography variant="h5">
              {t('views.familyProfile.lifemapNumber')}
              {family.numberOfSnapshots ? ' ' + family.numberOfSnapshots : 0}
            </Typography>
            <div className={classes.sumaryContainer}>
              <SummaryDonut
                greenIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countGreenIndicators
                    : 0
                }
                redIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countRedIndicators
                    : 0
                }
                yellowIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countYellowIndicators
                    : 0
                }
                skippedIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countSkippedIndicators
                    : 0
                }
                isAnimationActive={true}
                countingSection={false}
                width="35%"
              />
              <div className={classes.prioritiesAndAchievements}>
                <CountDetail
                  type="priority"
                  count={
                    family.snapshotIndicators
                      ? family.snapshotIndicators.countIndicatorsPriorities
                      : 0
                  }
                  label
                  countVariant="h5"
                />
                <Divider height={1} />
                <CountDetail
                  type="achievement"
                  count={
                    family.snapshotIndicators
                      ? family.snapshotIndicators.countIndicatorsAchievements
                      : 0
                  }
                  label
                  countVariant="h5"
                />
              </div>

              <SummaryBarChart
                greenIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countGreenIndicators
                    : 0
                }
                redIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countRedIndicators
                    : 0
                }
                yellowIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countYellowIndicators
                    : 0
                }
                skippedIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countSkippedIndicators
                    : 0
                }
                isAnimationActive={false}
                width="40%"
              />
            </div>
          </div>
          {/* Summary */}
          <div className={classes.lifemapContainer}>
            <Typography
              variant="h5"
              style={{ textAlign: 'center', paddingBottom: '5%' }}
            >
              {family.snapshotIndicators
                ? `${moment(family.snapshotIndicators.createdAt).format(
                    dateFormat
                  )}`
                : ''}
            </Typography>
            <AllSurveyIndicators
              draft={
                family.snapshotIndicators ? family.snapshotIndicators : null
              }
            />

            <Typography variant="subtitle1" className={classes.labelGreenRight}>
              <Link href="#" onClick={goToFamilyPsp}>
                {t('views.familyProfile.viewLifeMap')}
              </Link>
            </Typography>
          </div>
        </div>
      </Container>

      {/* Priorities */}
      <FamilyPriorities></FamilyPriorities>

      {/* AssignFacilitator */}
      {showAdministrationOptions(user) && (
        <Container className={classes.administratorContainer} variant="fluid">
          <Typography variant="h5">
            {t('views.familyProfile.administration')}
          </Typography>

          <div className={classes.administratorBox}>
            <Grid item xs={6}>
              <FacilitatorFilter
                data={selectedFacilitator}
                isMulti={false}
                onChange={onChangeFacilitator}
                label={t('views.familyProfile.facilitator')}
              />
            </Grid>
            <Grid item xs={5} style={{ marginLeft: '2rem' }}>
              <Button variant="contained" onClick={changeFacilitator}>
                {t('views.familyProfile.changeFacilitator')}
              </Button>
            </Grid>
          </div>
        </Container>
      )}
      <ConfirmationModal
        title={t('views.familyProfile.changeFacilitator')}
        subtitle={t('views.familyProfile.changeFacilitatorConfirm')}
        cancelButtonText={t('general.no')}
        continueButtonText={t('general.yes')}
        onClose={handleClose}
        open={showConfirmationModal}
        confirmAction={confirmChangeFacilitator}
      />
    </div>
  );
};

const styles = theme => ({
  donutContainer: {
    padding: `${theme.spacing(1)}px 0`,
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
    [theme.breakpoints.down('xs')]: {
      width: '100%!important'
    }
  },
  lifemapContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    //paddingRight: '15%',
    paddingLeft: '5%',
    [theme.breakpoints.down('xs')]: {
      width: '100%!important'
    }
  },
  graphContainer: {
    padding: `${theme.spacing(1)}px 0`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: '12%',
    paddingLeft: '12%'
  },
  sumaryContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  horizontalAlign: {
    display: 'flex',
    flexDirection: 'row'
    // padding: `${theme.spacing(0.5)}px 0`
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9
    //position: 'relative'
  },
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  administratorContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'left',
    marginTop: '2%',
    marginBottom: '2%',
    paddingRight: '12%',
    paddingLeft: '12%',
    paddingTop: '2%'
  },
  administratorBox: {
    display: 'flex',
    paddingTop: '3%',
    paddingBottom: '3%',
    flexDirection: 'row'
  },

  iconBaiconFamilyBorder: {
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    minWidth: 90,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-2%',
    position: 'relative'
  },
  iconFamily: {
    maxWidth: 50,
    maxHeight: 50,
    objectFit: 'contain'
  },
  chooseLifeMapImage: {
    display: 'block',
    height: 240,
    right: 30,
    position: 'absolute',
    top: -10,
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
    height: 220,
    zIndex: 1
  },
  mainSurveyContainerBoss: {
    backgroundColor: theme.palette.background.paper
  },
  iconGreen: { color: '#309E43' },
  iconGray: { color: '#6A6A6A' },
  labelGreen: {
    marginRight: 10,
    fontSize: 14,
    color: '#309E43',
    paddingLeft: 10
  },
  labelGreenRight: {
    marginRight: 20,
    fontSize: 14,
    color: '#309E43',
    paddingLeft: 10,
    paddingTop: 10,
    textAlign: 'right'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  iconBadgeNumber: {
    border: '2px solid #FFFFFF',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    position: 'absolute',
    top: 15,
    right: 15
  }
});

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withLayout(withSnackbar(FamilyProfile))))
  )
);
