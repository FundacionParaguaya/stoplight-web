import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getDateFormatByLocale } from '../utils/date-utils';
import { withSnackbar } from 'notistack';
import DimensionQuestion from './summary/DimensionQuestion';
import FamilyPriorities from './FamilyPriorities';
import FamilyAchievements from '../components/FamilyAchievements';
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
import { ROLES_NAMES } from '../utils/role-utils';
import {
  sendLifemapPdfv2,
  downloadPdf,
  sendWhatsappMessage,
  getPrioritiesAchievementsBySnapshot
} from '../api';

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
    height: 80,
    backgroundColor: theme.palette.background.default
  },
  buttonsContainer: {
    height: 80,
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
  labelContainer: {
    width: '100%',
    display: 'flex',
    paddingTop: 6
  },
  mainLabel: {
    width: 'auto',
    color: theme.palette.grey.middle
  }
}));

const DetailsOverview = ({
  familyId,
  family,
  mentor,
  index,
  snapshot,
  firstParticipant,
  user,
  reloadPage
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
    if (button === 'whatsapp' || button === 'email') {
      return (
        role === ROLES_NAMES.ROLE_SURVEY_USER ||
        role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN
      );
    } else if (button === 'download') {
      return (
        role === ROLES_NAMES.ROLE_HUB_ADMIN ||
        role === ROLES_NAMES.ROLE_APP_ADMIN ||
        role === ROLES_NAMES.ROLE_ROOT ||
        role === ROLES_NAMES.ROLE_PS_TEAM ||
        role === ROLES_NAMES.ROLE_SURVEY_USER ||
        role === ROLES_NAMES.ROLE_SURVEY_USER_ADMIN
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
      <div className={classes.headerContainer}>
        <div className={classes.textContainter}>
          <Typography variant="h5">
            {`${t('views.familyProfile.stoplight')} ${index + 1}`}
          </Typography>
          <div
            className={classes.labelContainer}
            style={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="h6" className={classes.mainLabel}>
              {`${t('views.familyProfile.mentor')}: `}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h6" style={{ width: 'auto' }}>
              {mentor.label}
            </Typography>
          </div>
        </div>
        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress size={50} thickness={2} />
          </div>
        )}
        <div className={classes.textContainter} style={{ textAlign: 'right' }}>
          <Typography variant="h5">
            {`${moment
              .unix(snapshot.snapshotDate)
              .utc()
              .format(dateFormat)}`}
          </Typography>
          <div
            className={classes.labelContainer}
            style={{ justifyContent: 'flex-end' }}
          >
            <Typography variant="h6" className={classes.mainLabel}>
              {`${t('views.familyProfile.organization')} `}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h6" style={{ width: 'auto' }}>
              {family.organization.name}
            </Typography>
          </div>
        </div>
      </div>

      <div className={classes.overviewContainer}>
        <div className={classes.gridContainer}>
          <Grid container spacing={4} className={classes.buttonsContainer}>
            {/* {firstParticipant.email && showButton('email', user) && ( */}
            <Grid item xs={12} sm={4} className={classes.buttonContainer}>
              <Button
                variant="outlined"
                color="primary"
                style={{ margin: 'auto' }}
                fullWidth
                disabled={loading}
                onClick={() => {
                  handleMailClick();
                }}
              >
                <MailIcon className={classes.leftIcon} />
                {t('views.final.email')}
              </Button>
            </Grid>
            {/*  )} */}
            {firstParticipant.phoneNumber && showButton('whatsapp', user) && (
              <Grid item xs={12} sm={4} className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  onClick={() => {
                    handleWhatsappClick();
                  }}
                >
                  <WhatsAppIcon className={classes.leftIcon} />
                  {t('views.final.whatsapp')}
                </Button>
              </Grid>
            )}
            {showButton('download', user) && (
              <Grid item xs={12} sm={4} className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  onClick={() => {
                    handleDownloadClick();
                  }}
                >
                  <DownloadIcon className={classes.leftIcon} />
                  {t('views.final.download')}
                </Button>
              </Grid>
            )}

            {showButton('delete', user, family) && (
              <Grid item xs={12} sm={4} className={classes.buttonContainer}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled={loading}
                  onClick={() => {
                    toggleDeleteModal();
                  }}
                >
                  <DeleteIcon className={classes.leftIcon} />
                  {t('views.final.deleteSnapshot')}
                </Button>
              </Grid>
            )}
          </Grid>
        </div>
        <DimensionQuestion
          questions={stoplight}
          priorities={priorities}
          achievements={achievements}
          isRetake={false}
        />
      </div>
      <FamilyPriorities
        stoplightSkipped={true}
        questions={snapshot}
        priorities={prioritiesList}
      ></FamilyPriorities>

      <FamilyAchievements achievements={achievementsList} />
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(DetailsOverview));
