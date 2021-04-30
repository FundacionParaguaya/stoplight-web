import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import TitleBar from '../../components/TitleBar';
import BottomSpacer from '../../components/BottomSpacer';
import Container from '../../components/Container';
import IndicatorsFilter, {
  FILTERED_BY_OPTIONS
} from '../../components/summary/IndicatorsFilter';
import LeaveModal from '../../components/LeaveModal';
import FooterPopup from '../../components/FooterPopup';
import { updateDraft } from '../../redux/actions';
import DimensionQuestion from '../../components/summary/DimensionQuestion';
import SummaryBarChart from '../../components/SummaryBarChart';
import SummaryDonut from '../../components/summary/SummaryDonut';

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

  goToNextView = () => {
    const {
      signSupport,
      pictureSupport
    } = this.props.currentSurvey.surveyConfig;
    if (pictureSupport && !this.props.currentDraft.justStoplight) {
      this.props.history.push('/lifemap/upload-pictures');
    } else if (signSupport && !this.props.currentDraft.justStoplight) {
      this.props.history.push('/lifemap/sign');
    } else {
      this.props.history.push('/lifemap/final');
    }
  };

  finishSurvey = () => {
    const { minimumPriorities } = this.props.currentSurvey;

    // TODO logic to check sign in config
    if (minimumPriorities === 0) {
      this.goToNextView();
    } else {
      if (minimumPriorities - this.props.currentDraft.priorities.length > 0) {
        this.setState({ openModal: true });
      } else {
        this.goToNextView();
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
        this.goToNextView();
      }
    }
  };

  getFooterTitle = () => {
    const { t } = this.props;
    let title;
    if (!this.props.currentDraft.previousIndicatorPriorities)
      title = t('views.overview.footerTitleCase1');
    else {
      title =
        this.props.currentDraft.previousIndicatorPriorities.length > 0
          ? t('views.overview.footerTitleCase2').replace(
              'XX',
              this.props.currentDraft.previousIndicatorPriorities.length.toString()
            )
          : t('views.overview.footerTitleCase3');
    }
    return title;
  };

  getFooterDescription = () => {
    const { t } = this.props;
    let description;
    if (!this.props.currentDraft.previousIndicatorPriorities)
      description = t('views.overview.footerDescriptionCase1');
    else {
      description =
        this.props.currentDraft.previousIndicatorPriorities.length > 0
          ? t('views.overview.footerDescriptionCase2')
          : t('views.overview.footerDescriptionCase3');
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
    // let gr1oupedAnswers;
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
            (this.props.currentDraft.priorities || []).length} ${
            this.props.currentSurvey.minimumPriorities -
              (this.props.currentDraft.priorities || []).length !==
            1
              ? t('views.lifemap.priorities').toLowerCase()
              : t('views.lifemap.priority').toLowerCase()
          }`}
          continueButtonText={t('general.gotIt')}
          singleAction
          onClose={this.toggleModal}
          open={this.state.openModal}
          leaveAction={this.toggleModal}
        />
        <TitleBar title={t('views.yourLifeMap')} progressBar />
        <Container className={classes.countersContainer}>
          <Container className={classes.containerInnerCounters}>
            <Container className={classes.donutChartContainer}>
              <SummaryDonut
                greenIndicatorCount={this.state.greenIndicatorCount}
                redIndicatorCount={this.state.redIndicatorCount}
                yellowIndicatorCount={this.state.yellowIndicatorCount}
                skippedIndicatorCount={this.state.skippedIndicatorCount}
                isAnimationActive={false}
                countingSection={false}
                width="100%"
                height={160}
              />
            </Container>
            <Container className={classes.barChartContainer}>
              <SummaryBarChart
                greenIndicatorCount={this.state.greenIndicatorCount}
                redIndicatorCount={this.state.redIndicatorCount}
                yellowIndicatorCount={this.state.yellowIndicatorCount}
                skippedIndicatorCount={this.state.skippedIndicatorCount}
                isAnimationActive={false}
                width="100%"
                height={this.state.skippedIndicatorCount !== 0 ? 240 : 180}
              />
            </Container>
          </Container>
        </Container>
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
              previousIndicators={currentDraft.previousIndicatorSurveyDataList}
              previousPriorities={currentDraft.previousIndicatorPriorities}
              previousAchivements={currentDraft.previousIndicatorAchivements}
              priorities={currentDraft.priorities}
              achievements={currentDraft.achievements}
              history={this.props.history}
              mustShowPointer={true}
              onClickIndicator={this.pushIndicator}
              isRetake={currentDraft.isRetake}
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
  },
  countersContainer: {
    paddingTop: '38px',
    paddingBottom: '16px',
    backgroundColor: theme.palette.background.default
  },
  donutChartContainer: {
    paddingRight: '15px',
    backgroundColor: theme.palette.background.default
  },
  barChartContainer: {
    paddingLeft: '15px',
    backgroundColor: theme.palette.background.default
  },
  containerInnerCounters: {
    minHeight: 180,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%'
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
