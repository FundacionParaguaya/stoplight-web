import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import IndicatorBall from '../../components/summary/IndicatorBall';
import IndicatorsFilter, {
  FILTERED_BY_OPTIONS
} from '../../components/summary/IndicatorsFilter';
import LeaveModal from '../../components/LeaveModal';
import FooterPopup from '../../components/FooterPopup';
import { updateDraft } from '../../redux/actions';
import DimensionQuestion from '../../components/summary/DimensionQuestion';

export class Overview extends Component {
  state = {
    showFooterPopup: true,
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
    indicatorFilterValue: FILTERED_BY_OPTIONS.ALL,
    openModal: false
  };

  toggleModal = () => {
    this.setState(prevState => ({ openModal: !prevState.openModal }));
  };

  handleFilterChange = filter => {
    this.setState({ indicatorFilterValue: filter });
  };

  handleFooterButtonClick = () => {
    this.setState({
      showFooterPopup: false
    });
  };

  finishSurvey = () => {
    const { minimumPriorities } = this.props.currentSurvey;
    if (minimumPriorities === 0) {
      this.props.history.push('/lifemap/final');
    } else {
      if (minimumPriorities - this.props.currentDraft.priorities.length > 0) {
        this.setState({ openModal: true });
      } else {
        this.props.history.push('/lifemap/final');
      }
      let priorDiff = 0;
      this.props.currentDraft.indicatorSurveyDataList.forEach(ele => {
        if (ele.value === 2 || ele.value === 1) {
          priorDiff += 1;
        }
      });
      if (
        minimumPriorities -
          minimumPriorities +
          priorDiff -
          this.props.currentDraft.priorities.length ===
        0
      ) {
        this.props.history.push('/lifemap/final');
      }
    }
  };

  getFooterTitle = () => {
    const minimumPriorities = this.props.currentSurvey.minimumPriorities || 0;
    const { t } = this.props;
    const prioritiesCount = this.props.currentDraft.priorities
      ? this.props.currentDraft.priorities.length
      : 0;
    let title;
    if (minimumPriorities === 0) {
      title = t('views.overview.noPriorityRequiredTitle');
    } else if (prioritiesCount === 0) {
      title = t('views.overview.allPrioritiesRemainingTitle');
    } else if (minimumPriorities - prioritiesCount > 1) {
      title = `${minimumPriorities - prioritiesCount} ${t(
        'views.overview.somePrioritiesRemainingTitle'
      )}`;
    } else if (minimumPriorities - prioritiesCount === 1) {
      title = t('views.overview.onePriorityRemainingTitle');
    } else {
      title = t('views.overview.noPriorityRemainingTitle');
    }
    return title;
  };

  getFooterDescription = () => {
    const minimumPriorities = this.props.currentSurvey.minimumPriorities || 0;
    const { t } = this.props;
    const prioritiesCount = this.props.currentDraft.priorities
      ? this.props.currentDraft.priorities.length
      : 0;
    let description;
    if (minimumPriorities === 0) {
      description = t('views.overview.noPriorityRequiredDescription');
    } else if (prioritiesCount === 0) {
      description = `${t(
        'views.overview.allPrioritiesRemainingDescription'
      )} ${minimumPriorities} ${
        minimumPriorities === 1
          ? t('views.overview.priority')
          : t('views.overview.priorities')
      }`;
    } else if (minimumPriorities - prioritiesCount > 1) {
      description = t('views.overview.somePrioritiesRemainingDescription');
    } else if (minimumPriorities - prioritiesCount === 1) {
      description = t('views.overview.onePriorityRemainingDescription');
    } else {
      description = t('views.overview.noPriorityRemainingDescription');
    }
    return description;
  };

  pushIndicator = indicator => {
    let forward = 'skipped-indicator';
    if (indicator.value) {
      forward = indicator.value === 3 ? 'achievement' : 'priority';
    }
    this.props.history.push(`${forward}/${indicator.key}`);
  };

  render() {
    const {
      t,
      classes,
      currentDraft,
      currentSurvey,
      forceHideStickyFooter,
      containerRef
    } = this.props;
    // let groupedAnswers;
    const userAnswers = [];

    if (currentSurvey) {
      currentSurvey.surveyStoplightQuestions.forEach(e => {
        currentDraft.indicatorSurveyDataList.forEach(ele => {
          if (e.codeName === ele.key) {
            userAnswers.push({
              value: ele.value,
              questionText: e.questionText,
              dimension: e.dimension,
              key: ele.key
            });
          }
        });
      });
      // groupedAnswers = userAnswers.reduce((r, a) => {
      //   // eslint-disable-next-line no-param-reassign
      //   r[a.dimension] = r[a.dimension] || [];
      //   r[a.dimension].push(a);
      //   return r;
      // }, {});
    }

    return (
      <div>
        <LeaveModal
          title={t('views.lifemap.toComplete')}
          subtitle={`${t('general.create')} ${this.props.currentSurvey
            .minimumPriorities -
            (this.props.currentDraft.priorities || []).length} ${t(
            'views.lifemap.priorities'
          )}`}
          continueButtonText={t('general.gotIt')}
          singleAction
          onClose={this.toggleModal}
          open={this.state.openModal}
          leaveAction={this.toggleModal}
        />
        <TitleBar title={t('views.yourLifeMap')} progressBar />
        <Container variant="stretch" ref={containerRef}>
          <IndicatorsFilter
            greenIndicatorCount={this.state.greenIndicatorCount}
            yellowIndicatorCount={this.state.yellowIndicatorCount}
            redIndicatorCount={this.state.redIndicatorCount}
            skippedIndicatorCount={this.state.skippedIndicatorCount}
            filterValue={this.state.indicatorFilterValue}
            onFilterChanged={this.handleFilterChange}
          />
          <div className={classes.questionsContainer}>
            <DimensionQuestion
              questions={userAnswers.filter(ind => {
                if (
                  this.state.indicatorFilterValue === FILTERED_BY_OPTIONS.ALL
                ) {
                  return true;
                }
                return ind.value === this.state.indicatorFilterValue;
              })}
              priorities={currentDraft.priorities}
              achievements={currentDraft.achievements}
              history={this.props.history}
              onClickIndicator={this.pushIndicator}
            />
          </div>
          {!this.state.showFooterPopup && (
            <div className={classes.finishSurveyButtonContainer}>
              <Button
                variant="contained"
                test-id="continue"
                onClick={this.finishSurvey}
                color="primary"
              >
                {t('general.continue')}
              </Button>
            </div>
          )}
          <BottomSpacer />
        </Container>
        {!forceHideStickyFooter && (
          <FooterPopup
            title={this.getFooterTitle()}
            description={this.getFooterDescription()}
            isOpen={this.state.showFooterPopup}
            handleButtonClick={this.handleFooterButtonClick}
            buttonText={t('views.overview.priorityFooterButton')}
          />
        )}
      </div>
    );
  }
}
const styles = theme => ({
  finishSurveyButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4)
  },
  questionsContainer: {
    padding: '45px',
    paddingBottom: 0
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});
const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Overview))
);
