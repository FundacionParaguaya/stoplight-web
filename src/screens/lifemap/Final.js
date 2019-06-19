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
// import MailIcon from '@material-ui/icons/Mail';
import Container from '../../components/Container';
import LeaveModal from '../../components/LeaveModal';
import { submitDraft } from '../../api';
import TitleBar from '../../components/TitleBar';
import AllSurveyIndicators from '../../components/summary/AllSurveyIndicators';
import BottomSpacer from '../../components/BottomSpacer';
import { ProgressBarContext } from '../../components/ProgressBar';
import generateIndicatorsReport from '../../pdfs/indicators-report';

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

  handleSubmit = () => {
    this.setState({
      loading: true
    });
    const { t } = this.props;

    // submit draft to server and wait for response
    submitDraft(this.props.user, this.props.currentDraft)
      .then(() => {
        this.toggleModal(
          t('general.thankYou'),
          t('views.final.lifemapSaved'),
          t('general.gotIt'),
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

  redirectToSurveys = () => {
    this.props.history.push(`/surveys?sid=${this.props.user.token}`);
  };

  render() {
    const {
      t,
      classes,
      i18n: { language }
    } = this.props;
    const { error } = this.state;

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
            {t('views.final.lifemapCompleted')}
          </Typography>
          <Typography variant="h5" className={classes.clickSafe}>
            {t('views.final.clickSafe')}
          </Typography>
          {/* <SummaryDonut
            greenIndicatorCount={this.state.greenIndicatorCount}
            yellowIndicatorCount={this.state.yellowIndicatorCount}
            redIndicatorCount={this.state.redIndicatorCount}
            skippedIndicatorCount={this.state.skippedIndicatorCount}
          /> */}
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
            <Grid container spacing={16}>
              {/* <Grid item xs={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={this.state.loading}
                >
                  <MailIcon className={classes.leftIcon} />
                  {t('views.final.email')}
                </Button>
              </Grid> */}
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
                    pdf.download(t('reports.indicators.myLifeMap'));
                  }}
                >
                  <DownloadIcon className={classes.leftIcon} />
                  {t('views.final.download')}
                </Button>
              </Grid>
              <Grid item xs={4} />
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  fullWidth
                  className={classes.saveButtonStyle}
                  disabled={this.state.loading}
                >
                  {t('general.close')}
                </Button>
              </Grid>
              <Grid item xs={4} />
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

const styles = theme => ({
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 6
  },
  clickSafe: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit
  },
  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 8
  },
  gridContainer: {
    marginLeft: theme.spacing.unit * 4 - 8,
    marginRight: theme.spacing.unit * 4 - 8,
    marginTop: theme.spacing.unit * 4
  },
  saveButtonStyle: { marginTop: theme.spacing.unit * 6 },
  leftIcon: {
    marginRight: theme.spacing.unit,
    fontSize: 20
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  },
  overviewContainer: { height: 0, width: 0, overflow: 'auto' },
  surveyIndicators: {
    maxWidth: '40%',
    margin: 'auto'
  }
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    {}
  )(withTranslation()(Final))
);
