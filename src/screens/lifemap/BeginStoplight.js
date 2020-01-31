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

  handleSubmit = () => {
    this.setState({
      loading: true
    });

    const {
      t,
      i18n: { language }
    } = this.props;

    // submit draft to server and wait for response
    submitDraft(this.props.user, {
      ...this.props.currentDraft,
      stoplightSkipped: true
    })
      .then(response => {
        const familyId = response.data.data.addSnapshot.family.familyId;
        console.log('Family ID');
        console.log(familyId);

        this.toggleModal(
          t('general.thankYou'),
          t('views.final.lifemapSaved'),
          t('general.gotIt'),
          'success',
          this.redirectToSurveys
        );
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
          {stoplightOptional && (
            <Button
              variant="contained"
              test-id="close"
              color="primary"
              onClick={this.handleSubmit}
              style={{ color: 'white' }}
            >
              {t('general.closeAndSign')}
            </Button>
          )}
          <br />
          <Button
            variant="contained"
            test-id="continue"
            color="primary"
            onClick={() => this.props.history.push('/lifemap/stoplight/0')}
            style={{ color: 'white' }}
          >
            {t('general.continue')}
          </Button>
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

const styles = {
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
  }
};

export default withStyles(styles)(
  connect(mapStateToProps)(withTranslation()(Begin))
);
