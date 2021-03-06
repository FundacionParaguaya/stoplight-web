import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Grid } from '@material-ui/core';
import TitleBar from '../../components/TitleBar';
import beginLifemap from '../../assets/begin_lifemap.png';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import LeaveModal from '../../components/LeaveModal';
import { updateDraft } from '../../redux/actions';

export class Begin extends Component {
  state = {
    loading: false,
    openModal: false,
    modalTitle: '',
    modalSubtitle: '',
    modalContinueButtonText: '',
    modalLeaveAction: null,
    modalVariant: ''
  };

  handleSkip = () => {
    // Delete stopligh section
    this.props.updateDraft({
      ...this.props.currentDraft,
      indicatorSurveyDataList: [],
      stoplightSkipped: true
    });
    if (this.props.currentSurvey.surveyConfig.pictureSupport) {
      this.props.history.push('/lifemap/upload-pictures');
    } else if (this.props.currentSurvey.surveyConfig.signSupport) {
      this.props.history.push('/lifemap/sign');
    } else {
      this.props.history.push('/lifemap/final');
    }
  };

  render() {
    const { classes, t, currentSurvey } = this.props;
    const questions = currentSurvey.surveyStoplightQuestions.length;
    const stoplightOptional = currentSurvey.surveyConfig.stoplightOptional;
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
        <TitleBar title={t('general.yourStoplight')} progressBar />
        <Container
          variant="stretch"
          className={classes.BeginStopLightContainer}
        >
          <Typography variant="h5" className={classes.stopLightTitleContainer}>
            {stoplightOptional
              ? t('views.lifemap.thisLifeMapHasNoStoplight').replace(
                  '%n',
                  questions
                )
              : t('views.lifemap.thisLifeMapHas').replace('%n', questions)}
          </Typography>
          <img
            className={classes.beginStopLightImage}
            src={beginLifemap}
            alt=""
          />

          <Grid container spacing={2} className={classes.buttonContainerForm}>
            {stoplightOptional && (
              <Grid item md={6} xs={12} container justify="center">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.handleSkip}
                  style={{ color: 'green', width: '20rem' }}
                >
                  {t('general.closeAndSign')}
                </Button>
              </Grid>
            )}
            <Grid item md={6} xs={12} container justify="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.props.history.push('/lifemap/stoplight/0')}
                style={{ color: 'white', width: '20rem' }}
              >
                {stoplightOptional
                  ? t('general.completeStoplight')
                  : t('general.continue')}
              </Button>
            </Grid>
          </Grid>
          <BottomSpacer />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft, user }) => ({
  currentSurvey,
  currentDraft,
  user
});

const styles = theme => ({
  buttonContainerForm: {
    marginBottom: theme.spacing(4),
    justifyContent: 'space-evenly',
    flex: 1,
    width: '100%'
  },
  BeginStopLightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stopLightTitleContainer: {
    width: '50%',
    margin: '50px auto 0 auto',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
      fontSize: 18,
      lineHeight: 1.2
    }
  },
  beginStopLightImage: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(10),
    position: 'relative',
    left: -10,
    [theme.breakpoints.down('md')]: {
      width: 400,
      marginBottom: theme.spacing(5)
    },
    [theme.breakpoints.down('500')]: {
      width: 300
    }
  },
  labelGreenRight: {
    marginRight: 20,
    fontSize: 16,
    color: theme.palette.primary.dark,
    paddingLeft: '3rem',
    textAlign: 'right'
  }
});

const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Begin))
);
