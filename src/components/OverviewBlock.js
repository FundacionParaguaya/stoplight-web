import React from 'react';
import { withStyles } from '@material-ui/styles';
import SummaryDonut from './summary/SummaryDonut';
import SummaryBarChart from './SummaryBarChart';
import CountDetail from './CountDetail';
import Divider from './Divider';

const OverviewBlock = ({ classes, data }) => {
  return (
    <>
      {data && (
        <div className={classes.container}>
          <SummaryDonut
            greenIndicatorCount={data.stoplightOverview.greens}
            redIndicatorCount={data.stoplightOverview.reds}
            yellowIndicatorCount={data.stoplightOverview.yellows}
            skippedIndicatorCount={data.stoplightOverview.skipped}
            isAnimationActive={false}
            countingSection={false}
          />
          <div className={classes.prioritiesAndAchievements}>
            <CountDetail
              type="priority"
              count={data.priorities}
              label
              countVariant="h5"
            />
            <Divider height={1} />
            <CountDetail
              type="achievement"
              count={data.achievements}
              label
              countVariant="h5"
            />
          </div>
          <SummaryBarChart
            greenIndicatorCount={5}
            redIndicatorCount={11}
            yellowIndicatorCount={2}
            skippedIndicatorCount={10}
            isAnimationActive={false}
          />
        </div>
      )}
    </>
  );
};

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  prioritiesAndAchievements: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5)
  }
});

export default withStyles(styles)(OverviewBlock);
