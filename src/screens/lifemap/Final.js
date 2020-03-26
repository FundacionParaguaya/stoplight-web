import React, { Component } from 'react';
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
import {
  submitDraft,
  sendMail,
  sendLifemapPdf,
  submitPictures
} from '../../api';
import TitleBar from '../../components/TitleBar';
import AllSurveyIndicators from '../../components/summary/AllSurveyIndicators';
import BottomSpacer from '../../components/BottomSpacer';
import { ProgressBarContext } from '../../components/ProgressBar';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import skippedLifemap from '../../assets/Family_center.png';

import generateIndicatorsReport, {
  getReportTitle
} from '../../pdfs/indicators-report';
import { upsertSnapshot } from '../../redux/actions';

export class Final extends Component {
  state = {
    loading: false,
    error: false,
    greenIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => indicator.value === 3
    ).length,
    yellowIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => indicator.value === 2
    ).length,
    redIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => indicator.value === 1
    ).length,
    skippedIndicatorCount: this.props.currentDraft.indicatorSurveyDataList.filter(
      indicator => !indicator.value
    ).length,
    openModal: false,
    modalTitle: '',
    modalSubtitle: '',
    modalContinueButtonText: '',
    modalLeaveAction: null,
    modalVariant: ''
  };

  toggleModal = (
    modalTitle,
    modalSubtitle,
    modalContinueButtonText,
    modalVariant,
    modalLeaveAction
  ) => {
    this.setState(prevState => ({
      openModal: !prevState.openModal,
      modalTitle,
      modalSubtitle,
      modalContinueButtonText,
      modalVariant,
      modalLeaveAction
    }));
  };

  handleSnapshotSubmit = (user, currentDraft) => {
    const { t } = this.props;
    // submit draft to server and wait for response
    submitDraft(user, currentDraft)
      .then(response => {
        const familyId = response.data.data.addSnapshot.family.familyId;
        console.log('Family ID');
        console.log(familyId);

        this.toggleModal(
          t('general.thankYou'),
          t('views.final.lifemapSaved'),
          t('general.ok'),
          'success',
          this.redirectToSurveys
        );
        // Reset ProgressBar Context
        this.context.setRouteTree = {};
      })
      .catch(() => {
        this.toggleModal(
          t('general.warning'),
          t('general.saveError'),
          t('general.gotIt'),
          'warning',
          () => this.toggleModal()
        );
      })
      .finally(() =>
        this.setState({
          loading: false
        })
      );
  };

  handleSubmit = () => {
    this.setState({
      loading: true
    });

    const {
      t,
      i18n: { language }
    } = this.props;

    const pdf = generateIndicatorsReport(
      this.props.currentDraft,
      this.props.currentSurvey,
      t,
      language
    );

    const draft = this.props.currentDraft;
    if (
      this.props.currentDraft.pictures &&
      this.props.currentDraft.pictures.length > 0
    ) {
      submitPictures(this.props.user, this.props.currentDraft)
        .then(response => {
          console.log(response.data);
          const pictures = response.data;
          draft.pictures = pictures;
          this.handleSnapshotSubmit(this.props.user, { ...draft });
        })
        .catch(() => {
          delete draft.pictures;
          this.handleSnapshotSubmit(this.props.user, { ...draft });
        });
    } else {
      this.handleSnapshotSubmit(this.props.user, this.props.currentDraft);
    }
  };

  redirectToSurveys = () => {
    this.props.history.push(`/surveys?sid=${this.props.user.token}`);
  };

  toggleLoading = () => {
    this.setState(prev => ({
      loading: !prev.loading
    }));
  };

  handleWhatsappClick = () => {
    const { t } = this.props;

    this.toggleModal(
      t('general.thankYou'),
      t('views.final.whatsappSent'),
      t('general.gotIt'),
      'success',
      this.closeModal
    );
  };

  handleMailClick = email => {
    const {
      t,
      i18n: { language }
    } = this.props;

    const pdf = generateIndicatorsReport(
      this.props.currentDraft,
      this.props.currentSurvey,
      t,
      language
    );

    this.toggleLoading();
    pdf.getBlob(blob => {
      const document = new File([blob], 'lifemap.pdf', {
        type: 'application/pdf'
      });
      return sendMail(document, email, this.props.user, language)
        .then(() => {
          this.toggleModal(
            t('general.thankYou'),
            t('views.final.emailSent'),
            t('general.gotIt'),
            'success',
            this.closeModal
          );
          this.toggleLoading();
        })
        .catch(() => {
          this.toggleModal(
            t('general.warning'),
            t('views.final.emailError'),
            t('general.gotIt'),
            'warning',
            this.closeModal
          );
          this.toggleLoading();
        });
    });
  };

  closeModal = e => {
    if (e) {
      this.setState({ openModal: false });
    }
  };

  render() {
    const stoplightSkipped =
      this.props.currentSurvey.surveyConfig.stoplightOptional &&
      this.props.currentDraft.indicatorSurveyDataList &&
      this.props.currentDraft.indicatorSurveyDataList.length === 0;

    console.log('Saltar?');
    console.log(stoplightSkipped);
    const {
      t,
      classes,
      i18n: { language }
    } = this.props;
    const { error } = this.state;
    const primaryParticipant = this.props.currentDraft.familyData
      .familyMembersList[0];

    return (
      <div>
        <LeaveModal
          title={this.state.modalTitle}
          subtitle={this.state.modalSubtitle}
          continueButtonText={this.state.modalContinueButtonText}
          singleAction
          onClose={() => {}}
          open={this.state.openModal}
          leaveAction={this.state.modalLeaveAction || (() => {})}
          variant={this.state.modalVariant}
        />
        <TitleBar title={t('views.final.title')} progressBar />
        <Container variant="stretch">
          <Typography variant="h5" className={classes.subtitle}>
            {stoplightSkipped
              ? t('views.final.surveyCompleted')
              : t('views.final.lifemapCompleted')}
          </Typography>
          <Typography variant="h5" className={classes.clickSafe}>
            {stoplightSkipped
              ? t('views.final.clickSafeWithoutStoplight')
              : t('views.final.clickSafe')}
          </Typography>

          <Container variant="slim">
            <AllSurveyIndicators />
          </Container>
          {error && <Typography color="error">{error}</Typography>}
          {this.state.loading && (
            <div className={classes.loadingContainer}>
              <CircularProgress size={50} thickness={2} />
            </div>
          )}

          <div className={classes.gridContainer}>
            {!stoplightSkipped ? (
              <Grid container spacing={2} className={classes.buttonContainer}>
                {primaryParticipant.email && (
                  <Grid item xs={12} sm={3}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      disabled={this.state.loading}
                      onClick={() => {
                        this.handleMailClick(primaryParticipant.email);
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
                      disabled={this.state.loading}
                      onClick={() => {
                        this.handleWhatsappClick();
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
                    disabled={this.state.loading}
                    onClick={() => {
                      const pdf = generateIndicatorsReport(
                        this.props.currentDraft,
                        this.props.currentSurvey,
                        t,
                        language
                      );
                      pdf.print();
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
                    disabled={this.state.loading}
                    onClick={() => {
                      const pdf = generateIndicatorsReport(
                        this.props.currentDraft,
                        this.props.currentSurvey,
                        t,
                        language
                      );
                      pdf.download(getReportTitle(this.props.currentDraft, t));
                    }}
                  >
                    <DownloadIcon className={classes.leftIcon} />
                    {t('views.final.download')}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Container variant="stretch" className={classes.imageContainer}>
                <img
                  className={classes.beginStopLightImage}
                  src={skippedLifemap}
                  alt=""
                />
              </Container>
            )}

            <Grid container spacing={2} className={classes.buttonContainer}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  fullWidth
                  className={classes.saveButtonStyle}
                  disabled={this.state.loading}
                  test-id="close"
                >
                  {stoplightSkipped
                    ? t('general.closeWithoutStoplight')
                    : t('general.close')}
                </Button>
              </Grid>
            </Grid>
          </div>
          <BottomSpacer />
        </Container>
      </div>
    );
  }
}

Final.contextType = ProgressBarContext;

const mapStateToProps = ({ currentDraft, currentSurvey, user }) => ({
  currentDraft,
  currentSurvey,
  user
});
const mapDispatchToProps = { upsertSnapshot };

const styles = theme => ({
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(6)
  },
  clickSafe: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing()
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

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Final))
);
