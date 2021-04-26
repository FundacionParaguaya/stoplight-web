import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IndicatorBall from '../../components/summary/IndicatorBall';

const indicatorColorByAnswer = indicator => {
  let color;
  if (!indicator) {
    color = 'skipped';
  } else if (indicator.value === 3) {
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

/* const getForwardURLForIndicator = indicator => {
  let forward = 'skipped-indicator';
  if (indicator.value) {
    forward = indicator.value === 3 ? 'achievement' : 'priority';
  }
  return `${forward}/${indicator.key}`;
}; */

const DimensionQuestion = ({
  classes,
  questions,
  previousIndicators,
  priorities,
  previousPriorities,
  achievements,
  previousAchivements,
  history,
  onClickIndicator,
  isRetake,
  mustShowPointer
}) => (
  <Grid container spacing={2}>
    {questions.map(indicator => {
      let previousIndicator;
      if (isRetake)
        previousIndicator = previousIndicators.find(
          prev => prev.key === indicator.key
        );
      const showPointer = mustShowPointer
        ? true
        : !priorities.find(
            prior => prior.snapshotStoplightId === indicator.snapshotStoplightId
          ) &&
          !achievements.find(
            achiev =>
              achiev.snapshotStoplightId === indicator.snapshotStoplightId
          );
      return (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          lg={2}
          key={indicator.key}
          onClick={() => onClickIndicator(indicator)}
          className={showPointer ? classes.gridItemStyle : ''}
        >
          <div className={classes.indicatorBallContainer}>
            {isRetake && (
              <IndicatorBall
                color={indicatorColorByAnswer(previousIndicator)}
                animated={false}
                priority={previousPriorities.find(
                  prior => prior.indicator === indicator.key
                )}
                achievement={previousAchivements.find(
                  prior => prior.indicator === indicator.key
                )}
                variant={'medium'}
                styles={{ marginRight: -12 }}
              />
            )}
            <IndicatorBall
              color={indicatorColorByAnswer(indicator)}
              animated={false}
              priority={priorities.find(prior => {
                const key = prior.snapshotStoplightId || prior.indicator;
                return (
                  key === indicator.snapshotStoplightId || key === indicator.key
                );
              })}
              achievement={achievements.find(prior => {
                const key = prior.snapshotStoplightId || prior.indicator;
                return (
                  key === indicator.snapshotStoplightId || key === indicator.key
                );
              })}
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
      );
    })}
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4)
  }
});

export default withStyles(dimensionQuestionsStyles)(DimensionQuestion);
