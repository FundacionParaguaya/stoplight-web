import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Container from '../../components/Container';
import LeaveModal from '../../components/LeaveModal';
import {
  submitDraft,
  submitPictures,
  attachSnapshotStoplight
} from '../../api';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import { ProgressBarContext } from '../../components/ProgressBar';
import skippedLifemap from '../../assets/Family_center.png';
import { upsertSnapshot, updateDraft } from '../../redux/actions';
import { ROLES_NAMES } from '../../utils/role-utils';
import Bugsnag from '@bugsnag/js';

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
    const stoplightSkipped =
      this.props.currentSurvey.surveyConfig.stoplightOptional &&
      currentDraft.indicatorSurveyDataList &&
      currentDraft.indicatorSurveyDataList.length === 0;
    submitDraft(
      user,
      currentDraft,
      this.props.currentSurvey.surveyConfig.surveyLocation
    )
      .then(response => {
        const snapshotId = response.data.data.addSnapshot.snapshotId;
        this.props.updateDraft({ ...currentDraft, snapshotId });

        const familyId = response.data.data.addSnapshot.family.familyId;
        this.handleRedirect(
          familyId,
          currentDraft.isRetake,
          stoplightSkipped,
          currentDraft.justStoplight
        );

        // Reset ProgressBar Context
        this.context.setRouteTree = {};
      })
      .catch(e => {
        console.error(e);
        Bugsnag.notify(e, event => {
          event.addMetadata('draft', { draft: currentDraft });
        });
        this.toggleModal(
          t('general.warning'),
          t('general.saveError').replace('%n', currentDraft.draftId),
          t('general.gotIt'),
          'warning',
          () => this.toggleModal()
        );
      });
  };

  handleSubmit = () => {
    this.setState({
      loading: true
    });

    const { currentDraft, t } = this.props;

    if (currentDraft.justStoplight) {
      attachSnapshotStoplight(this.props.user, currentDraft)
        .then(() => {
          this.handleRedirect('', '', '', true);
          // Reset ProgressBar Context
          this.context.setRouteTree = {};
        })
        .catch(e => {
          Bugsnag.notify(e, event => {
            event.addMetadata('draft', { draft: currentDraft });
          });
          this.toggleModal(
            t('general.warning'),
            t('general.saveError').replace('%n', currentDraft.draftId),
            t('general.gotIt'),
            'warning',
            () => this.toggleModal()
          );
        });
    } else if (
      (currentDraft.pictures && currentDraft.pictures.length > 0) ||
      currentDraft.sign
    ) {
      submitPictures(this.props.user, currentDraft)
        .then(response => {
          const pictures = response.data;
          currentDraft.pictures = pictures.filter(
            picture => picture.type !== 'sign'
          );
          const sign = pictures.find(picture => picture.type === 'sign');
          currentDraft.signFile = sign;
          delete currentDraft.sign;
          this.handleSnapshotSubmit(this.props.user, { ...currentDraft });
        })
        .catch(() => {
          delete currentDraft.pictures;
          this.handleSnapshotSubmit(this.props.user, { ...currentDraft });
        });
    } else {
      this.handleSnapshotSubmit(this.props.user, currentDraft);
    }
  };

  handleRedirect = (familyId, isRetake, stoplightSkipped, justStoplight) => {
    if (!stoplightSkipped) {
      this.redirectToSendLifeMap();
    } else {
      if (this.props.user.role === ROLES_NAMES.ROLE_FAMILY_USER) {
        this.props.history.history.push(`/my-profile`);
      } else if (isRetake || justStoplight) {
        this.redirectToFamilyProfile(familyId);
      } else {
        this.redirectToSurveys();
      }
    }
  };

  redirectToSendLifeMap = () => {
    this.props.history.push('send-lifemap');
  };

  redirectToSurveys = () => {
    this.props.history.push(`/surveys?sid=${this.props.user.token}`);
  };

  redirectToFamilyProfile = familyId => {
    this.props.history.push(`/family/${familyId}`);
  };

  componentDidMount() {
    this.setState({
      loading: false
    });
  }

  render() {
    const { t, classes } = this.props;
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
            {t('views.final.surveyCompleted')}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {this.state.loading && (
            <div className={classes.loadingContainer}>
              <CircularProgress size={50} thickness={2} />
            </div>
          )}

          <div className={classes.gridContainer}>
            <Container variant="stretch" className={classes.imageContainer}>
              <img
                className={classes.beginStopLightImage}
                src={skippedLifemap}
                alt=""
              />
            </Container>

            <Grid container spacing={2} className={classes.buttonContainer}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  fullWidth
                  className={classes.saveButtonStyle}
                  disabled={
                    this.state.loading ||
                    (!!this.props.currentDraft.snapshotId &&
                      !this.props.currentDraft.justStoplight)
                  }
                  test-id="close"
                >
                  {t('general.close')}
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
const mapDispatchToProps = { upsertSnapshot, updateDraft };

const styles = theme => ({
  subtitle: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: theme.spacing(6)
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
    height: '15rem',
    [theme.breakpoints.down('md')]: {
      height: '10rem',
      width: 400,
      marginTop: 20,
      marginBottom: 25
    }
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
