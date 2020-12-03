import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import PrintIcon from '@material-ui/icons/Print';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import MailIcon from '@material-ui/icons/Mail';
import Container from '../../components/Container';
import LeaveModal from '../../components/LeaveModal';
import EmailConfirmationModal from '../../components/EmailConfirmationModal';
import { sendLifemapPdfv2, downloadPdf, sendWhatsappMessage } from '../../api';
import TitleBar from '../../components/TitleBar';
import AllSurveyIndicators from '../../components/summary/AllSurveyIndicators';
import BottomSpacer from '../../components/BottomSpacer';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import HomeIcon from '@material-ui/icons/Home';
import { withSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: theme.spacing(6),
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: 1.2
    }
  },
  chooseOption: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '65%',
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: 1.2
    }
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
  saveButtonStyle: {
    height: 'fit-content',
    minHeight: 38,
    marginTop: theme.spacing(6),
    [theme.breakpoints.between(350, 600)]: {
      padding: 0
    }
  },
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
  }
});

const SendLifemap = ({
  classes,
  t,
  i18n: { language },
  history,
  enqueueSnackbar,
  closeSnackbar,
  currentDraft,
  user
}) => {
  const [modalData, setModalData] = useState({ openModal: false });
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailData, setEmailData] = useState({ openEmail: false, email: '' });
  const [primaryParticipant, setPrimaryParticipant] = useState({});

  useEffect(() => {
    let primaryParticipant = currentDraft.familyData.familyMembersList[0];
    setPrimaryParticipant(primaryParticipant);
    setEmailData({ openEmail: false, email: primaryParticipant.email });
  }, []);

  const handleContinue = (familyId, isRetake) => {
    if (isRetake) {
      redirectToFamilyProfile(familyId);
    } else {
      redirectToSurveys();
    }
  };

  const redirectToSurveys = () => {
    history.push(`/surveys`);
  };

  const redirectToFamilyProfile = familyId => {
    history.push(`/family/${familyId}`);
  };

  const handleWhatsappClick = () => {
    sendWhatsappMessage(currentDraft.snapshotId, user);
    setModalData({
      modalTitle: t('general.thankYou'),
      modalSubtitle: t('views.final.whatsappSent'),
      modalContinueButtonText: t('general.gotIt'),
      modalVariant: 'success',
      openModal: true
    });
  };

  const handleMailClick = email => {
    setSendingEmail(true);
    return sendLifemapPdfv2(currentDraft.snapshotId, user, language, email)
      .then(() => {
        setSendingEmail(false);
        enqueueSnackbar(t('views.final.emailSent'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        setEmailData({ openEmail: false, email: email });
      })
      .catch(() => {
        setSendingEmail(false);
        enqueueSnackbar(t('views.final.emailError'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
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
      <EmailConfirmationModal
        open={emailData.openEmail}
        onLeave={() => setEmailData({ ...emailData, openEmail: false })}
        handleSendMail={handleMailClick}
        email={emailData.email}
        loading={sendingEmail}
      />
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
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                disabled={loading}
                onClick={() => {
                  setEmailData({ ...emailData, openEmail: true });
                }}
              >
                <MailIcon className={classes.leftIcon} />
                {t('views.final.email')}
              </Button>
            </Grid>

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
                <HomeIcon className={classes.leftIcon} />
                {t('views.send.goTo')}
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
  withStyles(styles)(
    connect(mapStateToProps)(withTranslation()(withSnackbar(SendLifemap)))
  )
);
