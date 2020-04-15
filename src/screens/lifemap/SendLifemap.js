import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import PrintIcon from '@material-ui/icons/Print';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import MailIcon from '@material-ui/icons/Mail';
import Container from '../../components/Container';
import LeaveModal from '../../components/LeaveModal';
import { sendLifemapPdfv2, downloadPdf } from '../../api';
import TitleBar from '../../components/TitleBar';
import AllSurveyIndicators from '../../components/summary/AllSurveyIndicators';
import BottomSpacer from '../../components/BottomSpacer';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

const styles = theme => ({
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: theme.spacing(6)
  },
  chooseOption: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '65%',
    margin: 'auto'
  },
  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(8)
  },
  gridContainer: {
    marginLeft: theme.spacing(4) - 8,
    marginRight: theme.spacing(4) - 8,
    marginTop: theme.spacing(4)
  },
  saveButtonStyle: { marginTop: theme.spacing(6) },
  leftIcon: {
    marginRight: theme.spacing(),
    fontSize: 20
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  overviewContainer: { height: 0, width: 0, overflow: 'auto' },
  surveyIndicators: {
    maxWidth: '40%',
    margin: 'auto'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  beginStopLightImage: {
    marginTop: 40,
    marginBottom: 80,
    height: '15rem'
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});

const SendLifemap = ({
  classes,
  t,
  i18n: { language },
  history,
  currentDraft,
  user
}) => {
  const [modalData, setModalData] = useState({ openModal: false });
  const [loading, setLoading] = useState(false);
  const [primaryParticipant, setPrimaryParticipant] = useState({});

  useEffect(() => {
    setPrimaryParticipant(currentDraft.familyData.familyMembersList[0]);
  }, []);

  const handleContinue = (familyId, isRetake) => {
    if (isRetake) {
      redirectToFamilyProfile(familyId);
    } else {
      redirectToSurveys();
    }
  };

  const redirectToSurveys = () => {
    history.push(`/surveys?sid=${user.token}`);
  };

  const redirectToFamilyProfile = familyId => {
    history.push(`/family/${familyId}`);
  };

  const handleWhatsappClick = () => {
    setModalData({
      modalTitle: t('general.thankYou'),
      modalSubtitle: t('views.final.whatsappSent'),
      modalContinueButtonText: t('general.gotIt'),
      modalVariant: 'success',
      openModal: true
    });
  };

  const handleMailClick = () => {
    setLoading(true);
    return sendLifemapPdfv2(currentDraft.snapshotId, user, language)
      .then(() => {
        setModalData({
          modalTitle: t('general.thankYou'),
          modalSubtitle: t('views.final.emailSent'),
          modalContinueButtonText: t('general.gotIt'),
          modalVariant: 'success',
          openModal: true
        });
        setLoading(false);
      })
      .catch(() => {
        setModalData({
          modalTitle: t('general.warning'),
          modalSubtitle: t('views.final.emailError'),
          modalContinueButtonText: t('general.gotIt'),
          modalVariant: 'warning',
          openModal: true
        });
        setLoading(false);
      });
  };

  const handleFileAction = download => {
    setLoading(true);
    return downloadPdf(currentDraft.snapshotId, user, language)
      .then(response => {
        setLoading(false);
        let blob = new Blob([response.data], { type: 'application/pdf' });
        let url = window.URL.createObjectURL(blob);

        let tempLink = document.createElement('a');
        tempLink.href = url;
        if (download) {
          tempLink.setAttribute('download', 'Lifemap.pdf');
          tempLink.click();
        } else {
          tempLink.target = '_blank';
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
        }
      })
      .catch(e => {
        setModalData({
          modalTitle: t('general.warning'),
          modalSubtitle: t('views.final.downloadError'),
          modalContinueButtonText: t('general.gotIt'),
          modalVariant: 'warning',
          openModal: true
        });
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <LeaveModal
        title={modalData.modalTitle}
        subtitle={modalData.modalSubtitle}
        continueButtonText={modalData.modalContinueButtonText}
        singleAction
        onClose={() => {}}
        open={modalData.openModal}
        leaveAction={e => {
          if (e) {
            setModalData({ ...modalData, openModal: false });
          }
        }}
        variant={modalData.modalVariant}
      />
      <TitleBar title={t('views.send.title')} showButton={false} />
      <Container variant="stretch">
        <Typography variant="h5" className={classes.subtitle}>
          {t('views.send.subtitle')}
        </Typography>
        <Typography variant="h5" className={classes.chooseOption}>
          {t('views.send.chooseOption')}
        </Typography>

        <Container variant="slim">
          <AllSurveyIndicators />
        </Container>
        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress size={50} thickness={2} />
          </div>
        )}

        <div className={classes.gridContainer}>
          <Grid container spacing={2} className={classes.buttonContainer}>
            {primaryParticipant.email && (
              <Grid item xs={12} sm={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  onClick={() => {
                    handleMailClick(primaryParticipant.email);
                  }}
                >
                  <MailIcon className={classes.leftIcon} />
                  {t('views.final.email')}
                </Button>
              </Grid>
            )}

            {primaryParticipant.phoneNumber && (
              <Grid item xs={12} sm={3}>
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

            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                disabled={loading}
                onClick={() => {
                  handleFileAction(false);
                }}
              >
                <PrintIcon className={classes.leftIcon} />
                {t('views.final.print')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                disabled={loading}
                onClick={() => {
                  handleFileAction(true);
                }}
              >
                <DownloadIcon className={classes.leftIcon} />
                {t('views.final.download')}
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} className={classes.buttonContainer}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleContinue(
                    currentDraft.familyData.familyId,
                    currentDraft.isRetake
                  );
                }}
                fullWidth
                className={classes.saveButtonStyle}
                disabled={loading}
                test-id="close"
              >
                {t('general.ok')}
              </Button>
            </Grid>
          </Grid>
        </div>
        <BottomSpacer />
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user, currentDraft }) => ({
  user,
  currentDraft
});

export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(withTranslation()(SendLifemap)))
);
