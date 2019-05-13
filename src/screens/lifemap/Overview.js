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
import SummaryDonut from '../../components/summary/SummaryDonut';
import SummaryStackedBar from '../../components/summary/SummaryStackedBar';
import AllSurveyIndicators from '../../components/summary/AllSurveyIndicators';
import IndicatorBall from '../../components/summary/IndicatorBall';
import IndicatorsFilter, {
  FILTERED_BY_OPTIONS
} from '../../components/summary/IndicatorsFilter';
import LeaveModal from '../../components/LeaveModal';
import FooterPopup from '../../components/FooterPopup';
import { updateDraft } from '../../redux/actions';

const getForwardURLForIndicator = indicator => {
  let forward = 'skipped-indicator';
  if (indicator.value) {
    forward = indicator.value === 3 ? 'achievement' : 'priority';
  }
  return `${forward}/${indicator.key}`;
};

const indicatorColorByAnswer = indicator => {
  let color;
  if (indicator.value === 3) {
    color = 'green';
  } else if (indicator.value === 2) {
    color = 'yellow';
  } else if (indicator.value === 1) {
    color = 'red';
  } else if (indicator.value === 0) {
    color = 'skipped';
  }
  return color;
};

let DimensionHeader = ({
  classes,
  dimension,
  greenIndicatorCount,
  yellowIndicatorCount,
  redIndicatorCount,
  skippedIndicatorCount
}) => (
  <div className={classes.dimensionHeader}>
    <Typography className={classes.dimensionTitle} variant="subtitle1">
      {dimension}
    </Typography>
    <SummaryStackedBar
      greenIndicatorCount={greenIndicatorCount}
      yellowIndicatorCount={yellowIndicatorCount}
      redIndicatorCount={redIndicatorCount}
      skippedIndicatorCount={skippedIndicatorCount}
    />
    <div className={classes.dimensionUnderline} />
  </div>
);
const dimensionHeaderStyles = theme => ({
  dimensionHeader: {
    margin: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4
  },
  dimensionTitle: {
    marginBottom: theme.spacing.unit
  },
  dimensionUnderline: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    width: '100%',
    height: '1px',
    backgroundColor: '#DCDEE3'
  }
});
DimensionHeader = withStyles(dimensionHeaderStyles)(DimensionHeader);

let DimensionQuestions = ({
  classes,
  questions,
  priorities,
  achievements,
  history
}) => (
  <Grid container spacing={16}>
    {questions.map(indicator => (
      <Grid
        item
        xs={4}
        md={3}
        key={indicator.key}
        onClick={() => history.push(getForwardURLForIndicator(indicator))}
        className={classes.gridItemStyle}
      >
        <div className={classes.indicatorBallContainer}>
          <IndicatorBall
            color={indicatorColorByAnswer(indicator)}
            animated={false}
            priority={priorities.find(
              prior => prior.indicator === indicator.key
            )}
            achievement={achievements.find(
              prior => prior.indicator === indicator.key
            )}
          />
        </div>
        <Typography
          variant="subtitle1"
          align="center"
          className={classes.typographyStyle}
        >
          {indicator.questionText}
        </Typography>
      </Grid>
    ))}
  </Grid>
);

const dimensionQuestionsStyles = theme => ({
  gridItemStyle: { cursor: 'pointer' },
  indicatorBallContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  typographyStyle: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4
  }
});
DimensionQuestions = withStyles(dimensionQuestionsStyles)(DimensionQuestions);

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
      title = t('views.overview.noPriorityRemainingTitle');
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
      description = t('views.overview.noPriorityRemainingDescription');
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

  render() {
    const {
      t,
      classes,
      currentDraft,
      currentSurvey,
      forceHideStickyFooter,
      containerRef
    } = this.props;
    let groupedAnswers;
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
      groupedAnswers = userAnswers.reduce((r, a) => {
        // eslint-disable-next-line no-param-reassign
        r[a.dimension] = r[a.dimension] || [];
        r[a.dimension].push(a);
        return r;
      }, {});
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
        <TitleBar title={t('views.yourLifeMap')} />
        <Container variant="stretch" ref={containerRef}>
          <SummaryDonut
            greenIndicatorCount={this.state.greenIndicatorCount}
            yellowIndicatorCount={this.state.yellowIndicatorCount}
            redIndicatorCount={this.state.redIndicatorCount}
            skippedIndicatorCount={this.state.skippedIndicatorCount}
          />
          <AllSurveyIndicators />
          <IndicatorsFilter
            greenIndicatorCount={this.state.greenIndicatorCount}
            yellowIndicatorCount={this.state.yellowIndicatorCount}
            redIndicatorCount={this.state.redIndicatorCount}
            skippedIndicatorCount={this.state.skippedIndicatorCount}
            filterValue={this.state.indicatorFilterValue}
            onFilterChanged={this.handleFilterChange}
          />
          <div>
            {Object.keys(groupedAnswers).map(elem => (
              <div key={elem}>
                <DimensionHeader
                  dimension={elem}
                  greenIndicatorCount={
                    groupedAnswers[elem].filter(a => a.value === 3).length
                  }
                  yellowIndicatorCount={
                    groupedAnswers[elem].filter(a => a.value === 2).length
                  }
                  redIndicatorCount={
                    groupedAnswers[elem].filter(a => a.value === 1).length
                  }
                  skippedIndicatorCount={
                    groupedAnswers[elem].filter(a => !a.value).length
                  }
                />
                <DimensionQuestions
                  questions={groupedAnswers[elem].filter(ind => {
                    if (
                      this.state.indicatorFilterValue ===
                      FILTERED_BY_OPTIONS.ALL
                    ) {
                      return true;
                    }
                    return ind.value === this.state.indicatorFilterValue;
                  })}
                  priorities={currentDraft.priorities}
                  achievements={currentDraft.achievements}
                  history={this.props.history}
                />
              </div>
            ))}
          </div>
          {!this.state.showFooterPopup && (
            <div className={classes.finishSurveyButtonContainer}>
              <Button
                variant="contained"
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
    marginTop: theme.spacing.unit * 4
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});
const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Overview))
);
