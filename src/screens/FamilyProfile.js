import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { updateSurvey, updateDraft } from '../redux/actions';
import Container from '../components/Container';
import chooseLifeMap from '../assets/family.png';
import withLayout from '../components/withLayout';
import {
  getFamily,
  assignFacilitator,
  getPrioritiesAchievementByFamily,
  getLastSnapshot,
  getFamilyNotes,
  getFamilyImages,
  saveFamilyNote
} from '../api';
import { withSnackbar } from 'notistack';
import familyFace from '../assets/face_icon_large.png';
import MailIcon from '@material-ui/icons/Mail';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SummaryDonut from '../components/summary/SummaryDonut';
import SummaryBarChart from '../components/SummaryBarChart';
import CountDetail from '../components/CountDetail';
import FamilyNotes from '../components/FamilyNotes';
import Divider from '../components/Divider';
import AllSurveyIndicators from '../components/summary/AllSurveyIndicators';
import { getDateFormatByLocale } from '../utils/date-utils';
import moment from 'moment';
import FacilitatorFilter from '../components/FacilitatorFilter';
import Grid from '@material-ui/core/Grid';
import { ROLES_NAMES } from '../utils/role-utils';
import ConfirmationModal from '../components/ConfirmationModal';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import NavigationBar from '../components/NavigationBar';
import FamilyPriorities from '../components/FamilyPriorities';
import FamilyImages from '../components/FamilyImages';
import {
  getEconomicScreens,
  getConditionalQuestions,
  getElementsWithConditionsOnThem,
  snapshotToDraft
} from '../utils/survey-utils';
import { getSurveyById } from '../api';
import CircularProgress from '@material-ui/core/CircularProgress';
import FamilyAchievements from '../components/FamilyAchievements';
import SignatureImage from '../components/SignatureImage';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import GetAppIcon from '@material-ui/icons/GetApp';

const FamilyProfile = ({
  classes,
  user,
  t,
  i18n: { language },
  enqueueSnackbar,
  closeSnackbar,
  updateSurvey,
  updateDraft,
  history
}) => {
  //export class FamilyProfile extends Component {
  const [family, setFamily] = useState({});
  const [firtsParticipant, setFirtsParticipant] = useState({});
  let { familyId } = useParams();
  const dateFormat = getDateFormatByLocale(language);
  const [selectedFacilitator, setSelectedFacilitator] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [disabledFacilitator, setDisabledFacilitator] = useState(true);
  const [stoplightSkipped, setStoplightSkipped] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const [loadingSurvey, setLoadingSurvey] = useState(true);
  const [survey, setSurvey] = useState();
  const [familyNotes, setFamilyNotes] = useState([]);
  const [familyNote, setFamilyNote] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orgsId, setOrgsId] = useState();
  const [images, setImages] = useState([]);
  const [signatureImg, setSignatureImg] = useState({});
  const [imagePreview, setImagePreview] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const navigationOptions = [
    { label: t('views.familyProfile.families'), link: '/families' },
    { label: t('views.familyProfile.profile'), link: `/family/${familyId}` }
  ];

  const goToFamilyDetails = e => {
    history.push(`/detail/${familyId}`);
  };

  const changeFacilitator = () => {
    setShowConfirmationModal(true);
  };

  const handleClose = () => {
    setShowConfirmationModal(false);
  };

  const handleOpenImage = image => {
    setImagePreview(true);
    setImageUrl(image);
  };

  const handleCloseImage = () => {
    setImagePreview(false);
  };

  const showAdministrationOptions = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_HUB_ADMIN ||
      role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_ROOT ||
      role === ROLES_NAMES.ROLE_PS_TEAM
    );
  };

  const showSaveNoteOption = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_APP_ADMIN
    );
  };

  const onChangeFacilitator = (value, facilitators) => {
    setDisabledFacilitator(false);
    setSelectedFacilitator(value);
  };

  const confirmChangeFacilitator = () => {
    setDisabledFacilitator(true);
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
        console.error(e);
        setShowConfirmationModal(false);
        enqueueSnackbar(t('views.familyProfile.mentorError'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  const loadFamilies = (familyId, user) => {
    getFamily(familyId, user).then(response => {
      let members = response.data.data.familyById.familyMemberDTOList;
      let firtsParticipantMap = members.find(
        element => element.firstParticipant === true
      );

      setFamily(response.data.data.familyById);
      setOrgsId([{ value: response.data.data.familyById.organization.id }]);
      setFirtsParticipant(firtsParticipantMap);

      let mentor = {
        label: response.data.data.familyById.user.username,
        value: response.data.data.familyById.user.userId
      };
      setSelectedFacilitator(mentor);
      setStoplightSkipped(
        response.data.data.familyById.snapshotIndicators.stoplightSkipped
      );
      getSurveyById(
        user,
        response.data.data.familyById.snapshotIndicators.surveyId
      )
        .then(response => {
          setSurvey(response.data.data.surveyById);
        })
        .catch(() => {
          setLoadingSurvey(false);
        });
    });
  };

  const loadAchievementsPriorities = (familyId, user) => {
    getPrioritiesAchievementByFamily(user, Number(familyId))
      .then(response => {
        setPriorities(
          response.data.data.prioritiesAchievementsByFamily.priorities
        );
        setAchievements(
          response.data.data.prioritiesAchievementsByFamily.achievements
        );
      })
      .catch(e => {
        console.log(e);
        setLoadingSurvey(false);
        enqueueSnackbar(t('views.familyPriorities.errorLoading'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  const loadFamilyNotes = (familyId, user) => {
    getFamilyNotes(familyId, user)
      .then(response => {
        let notes = response.data.data.notesByFamily;
        setLoading(false);
        setFamilyNotes(notes);
      })
      .catch(e => {
        setLoading(false);
      });
  };

  const loadFamilyImages = (family, user) => {
    getFamilyImages(familyId, user).then(response => {
      const pictures = response.data.data.picturesSignaturesByFamily.filter(
        el => el.category === 'picture'
      );
      const signature = response.data.data.picturesSignaturesByFamily
        .filter(el => el.category === 'signature')
        .pop();

      setImages(pictures);
      setSignatureImg(signature);
    });
  };

  const handleSubmitNote = () => {
    setLoading(true);
    saveFamilyNote(familyId, familyNote, user)
      .then(() => {
        setFamilyNote('');
        enqueueSnackbar(t('views.familyProfile.familyNoteSuccess'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        loadFamilyNotes(familyId, user);
      })
      .catch(e => {
        setLoading(false);
        enqueueSnackbar(t('views.familyProfile.familyNoteError'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  useEffect(() => {
    loadFamilies(familyId, user);
    loadFamilyNotes(familyId, user);
    loadAchievementsPriorities(familyId, user);
    loadFamilyImages(familyId, user);
  }, []);

  useEffect(() => {
    !!family.name && setLoadingSurvey(false);
  }, [family]);

  const handleRetakeSurvey = e => {
    setLoadingSurvey(true);

    const economicScreens = getEconomicScreens(survey);
    const conditionalQuestions = getConditionalQuestions(survey);
    const elementsWithConditionsOnThem = getElementsWithConditionsOnThem(
      conditionalQuestions
    );
    updateSurvey({
      ...survey,
      economicScreens,
      conditionalQuestions,
      elementsWithConditionsOnThem
    });

    getLastSnapshot(familyId, user)
      .then(response => {
        const draft = snapshotToDraft(response, family, familyId);
        updateDraft({ ...draft });
      })
      .catch(() => {
        setLoadingSurvey(false);
      });
    setLoadingSurvey(false);
    history.push('/lifemap/terms');
  };

  const showRetakeButton = user => {
    return (
      (user.role === ROLES_NAMES.ROLE_SURVEY_USER ||
        user.role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
        user.role === ROLES_NAMES.ROLE_SURVEY_TAKER) &&
      survey &&
      family.allowRetake
    );
  };

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
            <Typography variant="h4" style={{ zIndex: 1 }}>
              {family.name}
            </Typography>
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
        {loadingSurvey && (
          <div className={classes.loadingSurveyContainer}>
            <CircularProgress />
          </div>
        )}
        <div className={classes.iconBaiconFamilyBorder}>
          <img
            src={familyFace}
            className={classes.iconFamily}
            alt="Family Member"
          />
          {family.familyMemberDTOList && family.familyMemberDTOList.length > 1 && (
            <div className={classes.iconBadgeNumber}>
              <Typography variant="h6" className={classes.badgeNumber}>
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
          {!stoplightSkipped && (
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
          )}
          {/* Summary */}
          <div
            className={classes.lifemapContainer}
            style={{ width: stoplightSkipped ? '80%' : '40%' }}
          >
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

            {!stoplightSkipped && (
              <Typography
                variant="subtitle1"
                className={classes.labelGreenRight}
              >
                <Link onClick={goToFamilyDetails} style={{ cursor: 'pointer' }}>
                  {t('views.familyProfile.viewLifeMap')}
                </Link>
              </Typography>
            )}
          </div>
        </div>
      </Container>
      {/* Condition to hide the retake banner */}
      {showRetakeButton(user) && (
        <div className={classes.buttonContainer}>
          <Typography variant="subtitle1" className={classes.retakeButton}>
            {t('views.familyProfile.createNewSnapshot')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleRetakeSurvey}
            className={classes.button}
          >
            {t('views.familyProfile.continueWithStoplight')}
          </Button>
        </div>
      )}

      {/* Priorities */}

      <FamilyPriorities
        familyId={familyId}
        stoplightSkipped={stoplightSkipped}
        questions={family.snapshotIndicators}
        priorities={priorities}
      ></FamilyPriorities>

      <FamilyAchievements
        familyId={familyId}
        achievements={achievements}
      ></FamilyAchievements>

      {/* Notes */}

      <FamilyNotes
        familyId={familyId}
        notes={familyNotes}
        note={familyNote}
        showCreateNote={user => showSaveNoteOption(user)}
        handleSaveNote={handleSubmitNote}
        handleInput={event => setFamilyNote(event.target.value)}
        loading={loading}
      />

      {/* Images */}
      <FamilyImages showImage={handleOpenImage} images={images} />

      {/* Signature Image */}
      <SignatureImage
        showImage={handleOpenImage}
        image={signatureImg ? signatureImg.url : ''}
      />

      <Dialog
        open={imagePreview}
        onClose={handleCloseImage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={classes.previewContent}>
          <img
            className={classes.imagePreview}
            src={imageUrl}
            alt={'Family gallery or signature'}
          />
        </DialogContent>
        <DialogActions>
          <Button
            href={imageUrl}
            className={classes.btnDialog}
            download
            color="primary"
          >
            <GetAppIcon />
            {t('views.familyProfile.download')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AssignFacilitator */}
      {showAdministrationOptions(user) && (
        <Container className={classes.administratorContainer} variant="fluid">
          <Typography variant="h5">
            {t('views.familyProfile.administration')}
          </Typography>

          <div className={classes.administratorBox}>
            <Grid item xs={6}>
              {!!orgsId && (
                <FacilitatorFilter
                  data={selectedFacilitator}
                  organizations={!!orgsId ? orgsId : null}
                  isMulti={false}
                  onChange={onChangeFacilitator}
                  label={t('views.familyProfile.facilitator')}
                />
              )}
            </Grid>
            <Grid item xs={5} style={{ marginLeft: '2rem' }}>
              <Button
                variant="contained"
                onClick={changeFacilitator}
                disabled={disabledFacilitator}
              >
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
        disabledFacilitator={disabledFacilitator}
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
    paddingLeft: '5%',
    [theme.breakpoints.down('xs')]: {
      width: '100%!important'
    }
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.dark
  },
  button: {
    ...theme.overrides.MuiButton.contained,
    width: '20%',
    minWidth: 350,
    marginLeft: '20%',
    margin: 30,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.dark,
    '&:hover': {
      backgroundColor: theme.palette.background.default
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
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9
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
    border: `2px solid ${theme.palette.background.default}`,
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
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
    top: -51,
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
  iconGreen: { color: theme.palette.primary.main },
  iconGray: { color: theme.palette.grey.middle },
  labelGreen: {
    marginRight: 10,
    fontSize: 14,
    color: theme.palette.primary.main,
    paddingLeft: 10
  },
  labelGreenRight: {
    marginRight: 20,
    fontSize: 14,
    color: theme.palette.primary.main,
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
    border: `2px solid ${theme.palette.background.default}`,
    borderRadius: '50%',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    position: 'absolute',
    top: 15,
    right: 15
  },
  badgeNumber: {
    fontSize: 9,
    color: theme.palette.grey.middle,
    fontWeight: 'bold'
  },
  loadingSurveyContainer: {
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  retakeButton: {
    ...theme.overrides.label,
    color: theme.palette.background.paper
  },
  imagePreview: {
    width: '100%'
  },
  previewContent: {
    overflowY: 'hidden'
  },
  btnDialog: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none'
    }
  }
});

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey, updateDraft };

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(withLayout(withSnackbar(FamilyProfile))))
  )
);
