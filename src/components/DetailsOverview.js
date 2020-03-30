import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getDateFormatByLocale } from '../utils/date-utils';
import { withSnackbar } from 'notistack';
import DimensionQuestion from './summary/DimensionQuestion';
import FamilyPriorities from './FamilyPriorities';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import LeaveModal from './LeaveModal';

const useStyles = makeStyles(theme => ({
  overviewContainer: {
    padding: '25px',
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
  buttonContainer: {
    height: 80,
    display: 'flex',
    justifyContent: 'center'
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
    height: 190
  },
  textContainter: {
    margin: 'auto',
    height: 60,
    width: '50%'
  },
  labelContainer: {
    width: '100%',
    display: 'flex'
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
  user
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

  const [loading, setLoading] = useState(false);

  const [modalTitle, setModalTitle] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [modalContinueButtonText, setModalContinueButtonText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalVariant, setModalVariant] = useState('');

  useEffect(() => {
    snapshot.achievements && setAchievements(snapshot.achievements);
    snapshot.priorities && setPriorities(snapshot.priorities);
    let stoplight = snapshot.stoplight.map(snapshotStoplight => {
      return {
        key: snapshotStoplight.codeName,
        value: snapshotStoplight.value,
        questionText: snapshotStoplight.shortName
      };
    });
    setStoplight(stoplight);
  }, []);

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

  const handleWhatsappClick = () => {
    toggleModal(
      t('general.thankYou'),
      t('views.final.whatsappSentOverview'),
      t('general.gotIt'),
      'success'
    );
  };

  const handleMailClick = () => {
    setLoading(true);
    /*    return sendMail(user, language)
         .then(() => {
           this.toggleModal(
             t('general.thankYou'),
             t('views.final.emailSent'),
             t('general.gotIt'),
             'success',
           );
           setLoading(false);
         })
         .catch(() => {
           this.toggleModal(
             t('general.warning'),
             t('views.final.emailError'),
             t('general.gotIt'),
             'warning'
           );
           setLoading(false);
         }); */
  };

  const handleDownloadClick = () => {
    setLoading(true);
    /*    return sendMail(user, language)
         .then(() => {
           setLoading(false);
         })
         .catch(() => {
           this.toggleModal(
             t('general.warning'),
             t('views.final.emailError'),
             t('general.gotIt'),
             'warning'
           );
           setLoading(false);
         }); */
  };

  return (
    <div className={classes.mainContainer}>
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

      <div className={classes.gridContainer}>
        <Grid container spacing={4} className={classes.buttonContainer}>
          {firstParticipant.email && (
            <Grid item xs={12} sm={4} style={{ margin: 'auto' }}>
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
          )}
          {firstParticipant.phoneNumber && (
            <Grid item xs={12} sm={4} style={{ margin: 'auto' }}>
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
          <Grid item xs={12} sm={4} style={{ margin: 'auto' }}>
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
        </Grid>
      </div>
      <div className={classes.overviewContainer}>
        <DimensionQuestion
          questions={stoplight}
          priorities={priorities}
          achievements={achievements}
          isRetake={false}
        />
      </div>
      <FamilyPriorities
        familyId={familyId}
        stoplightSkipped={true}
        questions={snapshot}
      ></FamilyPriorities>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withSnackbar(DetailsOverview));
