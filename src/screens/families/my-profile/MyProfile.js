import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  familyUserData,
  getFamilyImages,
  getFamilyNotes,
  getLastSnapshot,
  getPrioritiesAchievementByFamily,
  getSurveyById,
  saveFamilyNote
} from '../../../api';
import familyFace from '../../../assets/face_icon_large.png';
import Container from '../../../components/Container';
import FamilyAchievements from '../../../components/FamilyAchievements';
import FamilyImages from '../../../components/FamilyImages';
import FamilyNotes from '../../../components/FamilyNotes';
import FamilyPriorities from '../../../components/FamilyPriorities';
import ImagePreview from '../../../components/ImagePreview';
import SignatureImage from '../../../components/SignatureImage';
import withLayout from '../../../components/withLayout';
import { updateDraft, updateSurvey } from '../../../redux/actions';
import { ROLES_NAMES } from '../../../utils/role-utils';
import {
  getConditionalQuestions,
  getEconomicScreens,
  getElementsWithConditionsOnThem,
  snapshotToDraft
} from '../../../utils/survey-utils';
import Details from '../profile/Details';
import FamilyOverview from '../profile/FamilyOverview';
import DraftItem from './DraftItem';
import MyProfileHeader from './MyProfileHeader';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.paper
  },
  loadingContainer: {
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
  basicInfo: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 9
  },
  iconContainer: {
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
      margin: 30
    }
  }
}));

const MyProfile = ({
  enqueueSnackbar,
  closeSnackbar,
  updateSurvey,
  updateDraft,
  user,
  history
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);
  const [firtsParticipant, setFirtsParticipant] = useState({});
  const [stoplightSkipped, setStoplightSkipped] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [images, setImages] = useState([]);
  const [signatureImg, setSignatureImg] = useState({});
  const [familyNotes, setFamilyNotes] = useState([]);
  const [familyNote, setFamilyNote] = useState('');
  const [priorities, setPriorities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [survey, setSurvey] = useState();
  const [imagePreview, setImagePreview] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const showErrorMessage = message =>
    enqueueSnackbar(message, {
      variant: 'error',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });

  const showSuccessMessage = message =>
    enqueueSnackbar(message, {
      variant: 'success',
      action: key => (
        <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      )
    });

  const handleOpenImage = image => {
    setImagePreview(true);
    setImageUrl(image);
  };

  const loadFamilyData = user => {
    familyUserData(user)
      .then(response => {
        let family = response.data.data.familyUserData;
        let members = family.familyMemberDTOList;
        let firtsParticipantMap = members.find(
          element => element.firstParticipant === true
        );

        setFamily(family);
        setFirtsParticipant(firtsParticipantMap);
        setFamilyMembers(members);
        setStoplightSkipped(family.snapshotIndicators.stoplightSkipped);

        getSurveyById(user, family.snapshotIndicators.surveyId)
          .then(response => {
            setSurvey(response.data.data.surveyById);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            showErrorMessage(t('views.myProfile.error.loadingSurvey'));
          });
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
        showErrorMessage(t('views.myProfile.error.loadingFamily'));
      });
  };

  const loadAchievementsPriorities = (familyId, user) => {
    getPrioritiesAchievementByFamily(user, familyId)
      .then(response => {
        let data = response.data.data.prioritiesAchievementsByFamily;
        setPriorities(data.priorities);
        setAchievements(data.achievements);
      })
      .catch(e => {
        showErrorMessage(t('views.familyPriorities.errorLoading'));
      });
  };

  const loadFamilyNotes = (familyId, user) => {
    getFamilyNotes(familyId, user)
      .then(response => {
        let notes = response.data.data.notesByFamily;
        setFamilyNotes(notes);
      })
      .catch(e => {
        showErrorMessage(t('views.myProfile.error.loadingNotes'));
      });
  };

  const handleSubmitNote = () => {
    setLoading(true);
    saveFamilyNote(family.familyId, familyNote, user)
      .then(() => {
        setFamilyNote('');
        showSuccessMessage(t('views.familyProfile.familyNoteSuccess'));
        loadFamilyNotes(family.familyId, user);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showErrorMessage(t('views.familyProfile.familyNoteError'));
      });
  };

  const showSaveNoteOption = ({ role }) => {
    return (
      role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
      role === ROLES_NAMES.ROLE_SURVEY_USER ||
      role === ROLES_NAMES.ROLE_APP_ADMIN ||
      role === ROLES_NAMES.ROLE_FAMILY_USER
    );
  };

  const loadFamilyImages = (familyId, user) => {
    getFamilyImages(familyId, user)
      .then(response => {
        let files = response.data.data.picturesSignaturesByFamily;
        const pictures = files.filter(el => el.category === 'picture');
        const signature = files.filter(el => el.category === 'signature').pop();

        setImages(pictures);
        setSignatureImg(signature);
      })
      .catch(e => {
        showErrorMessage(t('views.familyProfile.familyNoteError'));
      });
  };

  const loadSurvey = justStoplight => {
    setLoading(true);

    getLastSnapshot(family.familyId, user)
      .then(response => {
        let draft = snapshotToDraft(response, family, family.familyId);
        if (justStoplight) {
          delete draft.isRetake;
        }
        updateDraft({
          ...draft,
          justStoplight,
          snapshotId: family.lastSnapshot
        });

        history.push({
          pathname: '/lifemap/terms',
          state: { projectId: null }
        });
      })
      .catch(() => {
        showErrorMessage(t('views.myProfile.error.loadingSurvey'));
        setLoading(false);
      });
  };

  const handleClickOnSnapshot = snapshot => {
    console.log(snapshot);
    const draft = { ...snapshot };
    const { lifemapNavHistory } = snapshot;
    delete draft.status;

    updateDraft({ ...draft, snapshotId: family.lastSnapshot });

    if (lifemapNavHistory && lifemapNavHistory.length > 0) {
      lifemapNavHistory.forEach(lnh =>
        history.push({
          pathname: lnh.url,
          state: lnh.state
        })
      );
    } else {
      history.push('/lifemap/terms');
    }
  };

  useEffect(() => {
    loadFamilyData(user);
  }, []);

  useEffect(() => {
    if (!!family.familyId) {
      loadFamilyNotes(family.familyId, user);
      loadAchievementsPriorities(family.familyId, user);
      loadFamilyImages(family.familyId, user);
    }
  }, [family]);

  useEffect(() => {
    if (!!survey) {
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
    }
  }, [survey]);

  return (
    <div className={classes.mainContainer}>
      <MyProfileHeader family={family} user={user} />

      {/* Firts Participant Information */}
      <Container className={classes.basicInfo} variant="fluid">
        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        )}
        <div className={classes.iconContainer}>
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

      {stoplightSkipped && snapshots.length === 0 && (
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => loadSurvey(true)}
            className={classes.button}
          >
            {t('views.myProfile.completeLifemap')}
          </Button>
        </div>
      )}

      <DraftItem
        user={user}
        snapshots={snapshots}
        setSnapshots={setSnapshots}
        handleClickOnSnapshot={draft => handleClickOnSnapshot(draft)}
      />

      {/* Priorities */}
      {!stoplightSkipped && (
        <FamilyPriorities
          familyId={family.familyId}
          stoplightSkipped={stoplightSkipped}
          questions={family.snapshotIndicators}
          priorities={priorities}
        />
      )}

      {/* Achievements */}
      {!stoplightSkipped && (
        <FamilyAchievements
          familyId={family.familyId}
          achievements={achievements}
        />
      )}

      {/* Notes */}
      <FamilyNotes
        familyId={family.familyId}
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
      {!!survey && !!survey.surveyConfig && survey.surveyConfig.signSupport && (
        <SignatureImage
          showImage={handleOpenImage}
          image={signatureImg ? signatureImg.url : ''}
          familyId={family.familyId}
          snapshotId={family.lastSnapshot}
          history={history}
          user={user}
        />
      )}

      <ImagePreview
        open={imagePreview}
        togglePreview={setImagePreview}
        imageUrl={imageUrl}
      />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = { updateSurvey, updateDraft };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withLayout(withSnackbar(MyProfile)))
);
