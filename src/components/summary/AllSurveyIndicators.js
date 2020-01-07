import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IndicatorBall from './IndicatorBall';

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

const AllSurveyIndicators = ({ classes, draftFromRedux, draft }) => {
  const currentDraft = draft || draftFromRedux;
  return (
    <div className={classes.summaryIndicatorsBallsContainer}>
      {currentDraft.indicatorSurveyDataList ? (
        currentDraft.indicatorSurveyDataList.map(indicator => {
          const color = indicatorColorByAnswer(indicator);
          return (
            <div
              key={indicator.key}
              className={classes.summaryIndicatorContainer}
            >
              <IndicatorBall
                color={color}
                variant="small"
                animated={false}
                priority={
                  currentDraft.priorities
                    ? currentDraft.priorities.find(
                        prior => prior.indicator === indicator.key
                      )
                    : null
                }
                achievement={
                  currentDraft.achievements
                    ? currentDraft.achievements.find(
                        prior => prior.indicator === indicator.key
                      )
                    : null
                }
              />
            </div>
          );
        })
      ) : (
        <div></div>
      )}
    </div>
  );
};

const styles = theme => ({
  summaryIndicatorContainer: {
    margin: 4
  },
  summaryIndicatorsBallsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(2)
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  surveyyFromRedux: currentSurvey,
  draftFromRedux: currentDraft
});
const mapDispatchToProps = {};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(AllSurveyIndicators)
);
