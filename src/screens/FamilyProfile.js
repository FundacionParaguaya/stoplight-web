import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import * as _ from 'lodash';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import {
  getFamily,
  getFamilyImages,
  getFamilyNotes,
  getLastSnapshot,
  getPrioritiesAchievementByFamily,
  getProjectsByOrganization,
  getSurveyById,
  saveFamilyNote
} from '../api';
import familyFace from '../assets/face_icon_large.png';
import Container from '../components/Container';
import FamilyAchievements from '../components/FamilyAchievements';
import FamilyImages from '../components/FamilyImages';
import FamilyNotes from '../components/FamilyNotes';
import FamilyPriorities from '../components/FamilyPriorities';
import SignatureImage from '../components/SignatureImage';
import withLayout from '../components/withLayout';
import { updateDraft, updateSurvey } from '../redux/actions';
import { useWindowSize } from '../utils/hooks-helpers';
import { checkAccessToProjects, ROLES_NAMES } from '../utils/role-utils';
import {
  getConditionalQuestions,
  getEconomicScreens,
  getElementsWithConditionsOnThem,
  snapshotToDraft
} from '../utils/survey-utils';
import FamilyHeader from './families/FamilyHeader';
import ChangeFacilitator from './families/profile/ChangeFacilitator';
import ChangeProject from './families/profile/ChangeProject';
import Details from './families/profile/Details';
import FamilyOverview from './families/profile/FamilyOverview';
import ProjectsModal from './lifemap/ProjectsModal';

const FamilyProfile = ({
  classes,
  user,
  t,
  enqueueSnackbar,
  closeSnackbar,
  updateSurvey,
  updateDraft,
  history
}) => {
  const windowSize = useWindowSize();
  const [family, setFamily] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);
  const [firtsParticipant, setFirtsParticipant] = useState({});
  let { familyId } = useParams();
  const [selectedFacilitator, setSelectedFacilitator] = useState({});
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
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);

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
      role === ROLES_NAMES.ROLE_ROOT //role_admin
    );
  };

  const showSaveNoteOption = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_APP_ADMIN
    );
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
      setFamilyMembers(members);

      let mentor = {
        label: response.data.data.familyById.user.username,
        value: response.data.data.familyById.user.userId
      };
      setSelectedFacilitator(mentor);
      setStoplightSkipped(
        response.data.data.familyById.snapshotIndicators.stoplightSkipped
      );
      const orgId = !!user.organization && user.organization.id;
      getProjectsByOrganization(user, !!orgId ? [orgId] : []).then(response => {
        const projects = _.get(
          response,
          'data.data.projectsByOrganization',
          []
        ).filter(project => project.active === true);
        setProjects(projects);
      });
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

  const handleRetakeSurvey = () => {
    projects.length > 0 ? setOpenModal(true) : loadSurvey();
  };

  const loadSurvey = (s, project) => {
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
        updateDraft({ ...draft, project: !!project ? project : null });
      })
      .catch(() => {
        setLoadingSurvey(false);
      });
    setLoadingSurvey(false);
    //Project id it's ignored since current draft it's already created in line 331 instruction
    history.push({
      pathname: '/lifemap/terms',
      state: { projectId: null }
    });
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

  const updateProject = project => {
    let updatedFamily = {
      ...family,
      project: { id: project.value, title: project.label }
    };
    setFamily(updatedFamily);
  };

  return (
    <div className={classes.mainSurveyContainerBoss}>
      <FamilyHeader family={family} user={user} />

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

      <FamilyOverview
        family={family}
        firtsParticipant={firtsParticipant}
        stoplightSkipped={stoplightSkipped}
        history={history}
      />

      {/* Condition to hide the retake banner */}
      {showRetakeButton(user) && (
        <div className={classes.buttonContainer}>
          {windowSize.width > 960 && (
            <Typography variant="subtitle1" className={classes.retakeButton}>
              {t('views.familyProfile.createNewSnapshot')}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleRetakeSurvey}
            className={classes.button}
          >
            {t('views.familyProfile.continueWithStoplight')}
          </Button>
        </div>
      )}

      <ProjectsModal
        open={openModal}
        afterSelect={loadSurvey}
        toggleModal={() => setOpenModal(!openModal)}
        projects={projects}
      />
      <Details
        primaryParticipant={firtsParticipant}
        familyMembers={familyMembers}
        latitude={family.latitude}
        longitude={family.longitude}
        economicData={family.snapshotEconomics}
        membersEconomicData={family.membersEconomic}
        survey={survey}
        history={history}
      />

      {/* Priorities */}

      <FamilyPriorities
        familyId={familyId}
        stoplightSkipped={stoplightSkipped}
        questions={family.snapshotIndicators}
        priorities={priorities}
      />

      <FamilyAchievements familyId={familyId} achievements={achievements} />

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
      {!!survey &&
        !!survey.surveyConfig &&
        survey.surveyConfig.pictureSupport && (
          <FamilyImages
            showImage={handleOpenImage}
            images={images}
            familyId={family.familyId}
            snapshotId={family.lastSnapshot}
            history={history}
            user={user}
          />
        )}

      {/* Signature Image */}
      {/* Images */}
      {!!survey && !!survey.surveyConfig && survey.surveyConfig.signSupport && (
        <SignatureImage
          showImage={handleOpenImage}
          image={signatureImg ? signatureImg.url : ''}
          familyId={familyId}
          snapshotId={family.lastSnapshot}
          history={history}
          user={user}
        />
      )}

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
        <DialogActions className={classes.btnContainer}>
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

      <Container className={classes.administratorContainer} variant="fluid">
        {/* AssignFacilitator */}
        {showAdministrationOptions(user) && (
          <React.Fragment>
            <Typography variant="h5" style={{ paddingTop: '2%' }}>
              {t('views.familyProfile.administration')}
            </Typography>

            <ChangeFacilitator
              familyId={familyId}
              currentFacilitator={selectedFacilitator}
              orgsId={orgsId}
            />
          </React.Fragment>
        )}
        {checkAccessToProjects(user) && (
          <ChangeProject
            familyId={familyId}
            currentProject={family.project}
            updateProject={updateProject}
          />
        )}
      </Container>
    </div>
  );
};

const styles = theme => ({
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
    margin: '10px 12%',
    paddingTop: 10,
    paddingBottom: 10,
    height: 'fit-content',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.dark,
    '&:hover': {
      backgroundColor: theme.palette.background.default
    },
    [theme.breakpoints.up('md')]: {
      width: '20%',
      minWidth: 350,
      marginLeft: '20%',
      margin: 30
    }
  },
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9
  },

  administratorContainer: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '2%',
    paddingTop: theme.spacing(1),
    paddingBottom: '2%',
    paddingRight: '12%',
    paddingLeft: '12%'
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
  mainSurveyContainerBoss: {
    backgroundColor: theme.palette.background.paper
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
  },
  btnContainer: {
    padding: '8px 24px'
  },
  facilitatorButton: {
    marginLeft: '2rem',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      display: 'flex',
      justifyContent: 'flex-end'
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
