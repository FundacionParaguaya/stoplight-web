import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IndicatorBall from '../../components/summary/IndicatorBall';

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

const getForwardURLForIndicator = indicator => {
  let forward = 'skipped-indicator';
  if (indicator.value) {
    forward = indicator.value === 3 ? 'achievement' : 'priority';
  }
  return `${forward}/${indicator.key}`;
};

const DimensionQuestion = ({
  classes,
  questions,
  priorities,
  achievements,
  history,
  onClickIndicator
}) => (
  <Grid container spacing={2}>
    {questions.map(indicator => (
      <Grid
        item
        xs={12}
        md={3}
        lg={2}
        key={indicator.key}
        onClick={() => onClickIndicator(indicator)}
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4)
  }
});

export default withStyles(dimensionQuestionsStyles)(DimensionQuestion);
