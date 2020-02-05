import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import TitleBar from '../../components/TitleBar';
import beginLifemap from '../../assets/begin_lifemap.png';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import { submitDraft } from '../../api';
import LeaveModal from '../../components/LeaveModal';
import Link from '@material-ui/core/Link';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

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

  handleSkip = () => {
    if (this.props.currentSurvey.surveyConfig.pictureSupport) {
      //TODO Push to Picture
      console.log('Redirect to pictures view');
      this.props.history.push('/lifemap/sign');
    } else if (this.props.currentSurvey.surveyConfig.signSupport) {
      this.props.history.push('/lifemap/sign');
    } else {
      this.props.history.push('/lifemap/final');
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

  closeModal = e => {
    if (e) {
      this.setState({ openModal: false });
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
        <TitleBar title={t('views.yourLifeMap')} progressBar />
        <Container
          variant="stretch"
          className={classes.BeginStopLightContainer}
        >
          <Typography variant="h5" className={classes.StopLightTitleContainer}>
            {t('views.lifemap.thisLifeMapHas').replace('%n', questions)}
          </Typography>
          <img
            className={classes.beginStopLightImage}
            src={beginLifemap}
            alt=""
          />

          <div className={classes.buttonContainerForm}>
            <div style={{ display: 'flex', flex: 1 }}></div>
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                test-id="close"
                color="primary"
                onClick={() => this.props.history.push('/lifemap/stoplight/0')}
                style={{ color: 'white' }}
              >
                {t('general.continueStoplight')}
              </Button>
            </div>

            <div
              style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              {stoplightOptional && (
                <Typography
                  variant="subtitle1"
                  className={classes.labelGreenRight}
                >
                  <Link href="#" onClick={this.handleSkip}>
                    {t('general.closeAndSign')}
                    <ArrowForwardIosIcon style={{ verticalAlign: 'middle' }} />
                  </Link>
                </Typography>
              )}
            </div>
          </div>
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
    display: 'flex',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    justifyContent: 'center',
    width: '100%'
  },
  BeginStopLightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  StopLightTitleContainer: {
    width: '50%',
    margin: '50px auto 0 auto',
    textAlign: 'center'
  },
  beginStopLightImage: {
    marginTop: 40,
    marginBottom: 80,
    position: 'relative',
    left: -10
  },
  labelGreenRight: {
    marginRight: 20,
    fontSize: 16,
    color: '#309E43',
    paddingLeft: '3rem',
    textAlign: 'right'
  }
});

export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(Begin))
);
