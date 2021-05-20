import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getDateFormatByLocale } from '../utils/date-utils';
import { withSnackbar } from 'notistack';
import DimensionQuestion from './summary/DimensionQuestion';
import FamilyAchievements from './FamilyAchievements';
import FamilyImages from './FamilyImages';
import FamilyPriorities from './FamilyPriorities';
import SignatureImage from './SignatureImage';
import DeleteSnapshotModal from '../components/DeleteSnapshotModal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import LeaveModal from './LeaveModal';
import { ROLES_NAMES, checkAccessToProjects } from '../utils/role-utils';
import {
  sendLifemapPdfv2,
  downloadPdf,
  sendWhatsappMessage,
  getPrioritiesAchievementsBySnapshot,
  picturesSignaturesBySnapshot
} from '../api';
import ImagePreview from './ImagePreview';
import Details from '../screens/families/profile/Details';
import FamilyInterventions from '../screens/families/profile/FamilyInterventions';

const useStyles = makeStyles(theme => ({
  overviewContainer: {
    padding: 25,
    paddingBottom: 0,
    backgroundColor: theme.palette.background.default
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto'
  },
  leftIcon: {
    marginRight: theme.spacing(),
    fontSize: 20
  },
  gridContainer: {
    marginBottom: 5,
    backgroundColor: theme.palette.background.default
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    '&:first-child:nth-last-child(1)': {
      margin: 'auto'
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  mainContainer: {
    paddingLeft: '12%',
    paddingRight: '12%',
    backgroundColor: theme.palette.background.default
  },
  headerContainer: {
    display: 'inline-flex',
    width: '100%',
    height: 150
  },
  textContainter: {
    margin: 'auto',
    height: 60,
    width: '50%'
  },
  textContainter2: {
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  headerDataContainerRight: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
  },
  headerDataContainerLeft: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  labelContainer2: {
    margin: 'auto',
    width: '100%',
    display: 'flex',
    overflowX: 'auto'
  },
  labelContainer: {
    width: '100%',
    display: 'flex',
    paddingTop: 6
  },
  titleLabel: {
    width: 'auto',
    fontSize: 22,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    },
    fontWeight: 600,
    letterSpacing: 0.24,
    color: theme.palette.grey.middle,
    fontFamily: 'Poppins'
  },
  subtitleLabel: {
    width: 'auto',
    fontSize: 18,
    fontFamily: 'Poppins',
    [theme.breakpoints.down('sm')]: {
      fontSize: 16
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    },
    color: theme.palette.grey.middle
  },
  valueLabel: {
    width: 'auto',
    paddingLeft: 8,
    fontSize: 18,
    fontFamily: 'Poppins',
    textTransform: 'capitalize',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      paddingLeft: 0
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      paddingLeft: 0
    }
  },
  dimensionQuestionsContainer: {
    marginTop: '30px'
  },
  buttonLabel: {
    fontWeight: 600,
    fontSize: 16,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14
    },
    fontFamily: 'Poppins',
    letterSpacing: 0.25
  },
  actionButtonContainer: {
    '&:first-child:nth-last-child(1)': {
      margin: 'auto'
    },
    display: 'flex',
    justifyContent: 'center'
  },
  actionButton: {
    width: 300,
    height: 34
  }
}));

const DetailsOverview = ({
  family,
  index,
  snapshot,
  firstParticipant,
  user,
  reloadPage,
  survey
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const dateFormat = getDateFormatByLocale(language);
  const [stoplight, setStoplight] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [prioritiesList, setPrioritiesList] = useState([]);
  const [images, setImages] = useState([]);
  const [signatureImg, setSignatureImg] = useState({});
  const [imagePreview, setImagePreview] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(false);

  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [modalContinueButtonText, setModalContinueButtonText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalVariant, setModalVariant] = useState('');
  const [achievementsList, setAchievementsList] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    setAchievements(snapshot.achievements ? snapshot.achievements : []);
    setPriorities(snapshot.priorities ? snapshot.priorities : []);
    let stoplight = snapshot.stoplight.map(snapshotStoplight => {
      return {
        key: snapshotStoplight.codeName,
        value: snapshotStoplight.value,
        questionText: snapshotStoplight.lifemapName
      };
    });
    setStoplight(stoplight);
    loadPrioritiesAchievements(user, snapshot.snapshotId);
    loadPictures(snapshot.snapshotId, user);
  }, [snapshot.snapshotId]);

  const toggleModal = (
    modalTitle,
    modalSubtitle,
    modalContinueButtonText,
    modalVariant
  ) => {
    setModalTitle(modalTitle);
    setModalSubtitle(modalSubtitle);
    setModalContinueButtonText(modalContinueButtonText);
    setModalVariant(modalVariant);
    setOpenModal(true);
  };

  const loadPrioritiesAchievements = (user, snapshotId) => {
    getPrioritiesAchievementsBySnapshot(user, Number(snapshotId)).then(
      response => {
        setPrioritiesList(
          response.data.data.prioritiesAchievementsBySnapshot.priorities
        );
        setAchievementsList(
          response.data.data.prioritiesAchievementsBySnapshot.achievements
        );
      }
    );
  };

  const loadPictures = (snapshotId, user) => {
    picturesSignaturesBySnapshot(snapshotId, user)
      .then(response => {
        let files = response.data.data.picturesSignaturesBySnapshot;
        const pictures = files.filter(el => el.category === 'picture');
        const signature = files.filter(el => el.category === 'signature').pop();

        setImages(pictures);
        setSignatureImg(signature);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const handleOpenImage = image => {
    setImagePreview(true);
    setImageUrl(image);
  };

  const handleWhatsappClick = () => {
    sendWhatsappMessage(snapshot.snapshotId, user);
    toggleModal(
      t('general.thankYou'),
      t('views.final.whatsappSentOverview'),
      t('general.gotIt'),
      'success'
    );
  };

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleMailClick = () => {
    setLoading(true);
    return sendLifemapPdfv2(snapshot.snapshotId, user, language)
      .then(() => {
        toggleModal(
          t('general.thankYou'),
          t('views.final.emailSent'),
          t('general.gotIt'),
          'success'
        );
        setLoading(false);
      })
      .catch(() => {
        toggleModal(
          t('general.warning'),
          t('views.final.emailError'),
          t('general.gotIt'),
          'warning'
        );
        setLoading(false);
      });
  };

  const handleDownloadClick = () => {
    setLoading(true);
    return downloadPdf(snapshot.snapshotId, user, language)
      .then(response => {
        setLoading(false);
        let blob = new Blob([response.data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(blob);

        let tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', 'Lifemap.pdf');
        tempLink.click();
      })
      .catch(e => {
        toggleModal(
          t('general.warning'),
          t('views.final.downloadError'),
          t('general.gotIt'),
          'warning'
        );
        setLoading(false);
      });
  };

  const showButton = (button, { role }, family) => {
    if (button === 'whatsapp') {
      return (
        (role === ROLES_NAMES.ROLE_SURVEY_USER ||
          role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN) &&
        !snapshot.stoplightSkipped
      );
    } else if (button === 'email') {
      return (
        (role === ROLES_NAMES.ROLE_SURVEY_USER ||
          role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN ||
          role === ROLES_NAMES.ROLE_APP_ADMIN) &&
        !snapshot.stoplightSkipped
      );
    } else if (button === 'download') {
      return (
        (role === ROLES_NAMES.ROLE_HUB_ADMIN ||
          role === ROLES_NAMES.ROLE_APP_ADMIN ||
          role === ROLES_NAMES.ROLE_ROOT ||
          role === ROLES_NAMES.ROLE_PS_TEAM ||
          role === ROLES_NAMES.ROLE_SURVEY_USER ||
          role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN) &&
        !snapshot.stoplightSkipped
      );
    } else if (button === 'delete') {
      return (
        (role === ROLES_NAMES.ROLE_APP_ADMIN ||
          role === ROLES_NAMES.ROLE_ROOT) &&
        (family && family.numberOfSnapshots) > 1
      );
    } else {
      return false;
    }
  };

  return (
    <div className={classes.mainContainer}>
      <DeleteSnapshotModal
        open={openDeleteModal}
        onClose={toggleDeleteModal}
        snapshot={snapshot && snapshot.snapshotId}
        afterSubmit={reloadPage}
      />

      <LeaveModal
        title={modalTitle}
        subtitle={modalSubtitle}
        continueButtonText={modalContinueButtonText}
        singleAction
        onClose={() => {}}
        open={openModal}
        leaveAction={e => {
          if (e) {
            setOpenModal(false);
          }
        }}
        variant={modalVariant}
      />
      <div style={{ paddingTop: 45, paddingBottom: 45 }}>
        <div className={classes.textContainter2}>
          <Typography className={classes.titleLabel}>
            {`${t('views.familyProfile.stoplight')} ${index + 1}`}
          </Typography>
          <Typography className={classes.titleLabel}>
            {`${moment
              .unix(snapshot.snapshotDate)
              .utc(true)
              .format(dateFormat)}`}
          </Typography>
        </div>

        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress size={50} thickness={2} />
          </div>
        )}

        <div className={classes.textContainter2}>
          <div className={classes.headerDataContainerLeft}>
            <Typography className={classes.subtitleLabel}>
              {`${t('views.familyProfile.mentor')}:`}
            </Typography>
            <Typography className={classes.valueLabel}>
              {''.concat(snapshot.surveyUser)}
            </Typography>
          </div>

          <div className={classes.headerDataContainerRight}>
            <Typography className={classes.subtitleLabel}>
              {`${t('views.familyProfile.organization')} `}
            </Typography>
            <Typography className={classes.valueLabel}>
              {family.organization.name}
            </Typography>
          </div>
        </div>
        <div
          style={{ justifyContent: 'flex-end' }}
          className={classes.textContainter2}
        >
          <div className={classes.headerDataContainerRight}>
            {checkAccessToProjects(user) && !!snapshot.projectTitle && (
              <React.Fragment>
                <Typography className={classes.subtitleLabel}>
                  {t('views.familyProfile.projectTitle')}
                </Typography>
                <Typography className={classes.valueLabel}>
                  {snapshot.projectTitle}
                </Typography>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>

      <Details
        primaryParticipant={firstParticipant}
        familyMembers={snapshot.familyData.familyMembersList}
        latitude={snapshot.familyData.latitude}
        longitude={snapshot.familyData.longitude}
        economicData={snapshot.economic}
        membersEconomicData={snapshot.membersEconomic}
        survey={survey}
        readOnly
      />

      <div className={classes.gridContainer}>
        <Grid container spacing={4} className={classes.buttonsContainer}>
          {firstParticipant.email && showButton('email', user) && (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              className={classes.actionButtonContainer}
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.actionButton}
                disabled={loading}
                onClick={() => {
                  handleMailClick();
                }}
              >
                <MailIcon className={classes.leftIcon} />
                <Typography className={classes.buttonLabel}>
                  {t('views.final.email')}
                </Typography>
              </Button>
            </Grid>
          )}
          {firstParticipant.phoneNumber && showButton('whatsapp', user) && (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              className={classes.actionButtonContainer}
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.actionButton}
                disabled={loading}
                onClick={() => {
                  handleWhatsappClick();
                }}
              >
                <WhatsAppIcon className={classes.leftIcon} />
                <Typography className={classes.buttonLabel}>
                  {t('views.final.whatsapp')}
                </Typography>
              </Button>
            </Grid>
          )}
          {showButton('download', user) && (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              className={classes.actionButtonContainer}
            >
              <Button
                variant="outlined"
                color="primary"
                className={classes.actionButton}
                disabled={loading}
                onClick={() => {
                  handleDownloadClick();
                }}
              >
                <DownloadIcon className={classes.leftIcon} />
                <Typography className={classes.buttonLabel}>
                  {t('views.final.download')}
                </Typography>
              </Button>
            </Grid>
          )}

          {showButton('delete', user, family) && (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              className={classes.actionButtonContainer}
            >
              <Button
                variant="outlined"
                color="secondary"
                className={classes.actionButton}
                disabled={loading}
                onClick={() => {
                  toggleDeleteModal();
                }}
              >
                <DeleteIcon className={classes.leftIcon} />
                <Typography className={classes.buttonLabel}>
                  {t('views.final.deleteSnapshot')}
                </Typography>
              </Button>
            </Grid>
          )}
        </Grid>
      </div>

      <div className={classes.overviewContainer}>
        <div className={classes.dimensionQuestionsContainer}>
          <DimensionQuestion
            questions={stoplight}
            priorities={priorities}
            achievements={achievements}
            isRetake={false}
            onClickIndicator={() => {}}
          />
        </div>
      </div>

      {!snapshot.stoplightSkipped && (
        <FamilyPriorities
          stoplightSkipped={false}
          questions={snapshot}
          priorities={prioritiesList}
          fullWidth={true}
          readOnly
        />
      )}

      {!snapshot.stoplightSkipped && (
        <FamilyAchievements
          stoplightSkipped={false}
          questions={snapshot}
          achievements={achievementsList}
          fullWidth={true}
          readOnly
        />
      )}

      {/* Interventions */}
      <FamilyInterventions
        questions={snapshot.stoplight}
        snapshotId={snapshot.snapshotId}
        readOnly
      />

      {/* Images */}
      {images.length > 0 && (
        <FamilyImages
          showImage={handleOpenImage}
          images={images}
          readOnly
          user={user}
        />
      )}

      {/* Signature Image */}
      {!!signatureImg && !!signatureImg.url && (
        <SignatureImage
          showImage={handleOpenImage}
          image={signatureImg ? signatureImg.url : ''}
          readOnly
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

export default connect(mapStateToProps)(withSnackbar(DetailsOverview));
