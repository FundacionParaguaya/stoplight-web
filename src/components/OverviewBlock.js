import React from 'react';
import { withStyles } from '@material-ui/styles';
import SummaryDonut from './summary/SummaryDonut';
import SummaryBarChart from './SummaryBarChart';
import CountDetail from './CountDetail';
import Divider from './Divider';

const OverviewBlock = ({ classes }) => {
  return (
    <div className={classes.container}>
      <SummaryDonut
        greenIndicatorCount={12}
        redIndicatorCount={11}
        yellowIndicatorCount={10}
        skippedIndicatorCount={10}
        isAnimationActive={false}
        countingSection={false}
      />
      <div className={classes.prioritiesAndAchievements}>
        <CountDetail type="priority" count={20} label countVariant="h5" />
        <Divider height={1} />
        <CountDetail type="achievement" count={22} label countVariant="h5" />
      </div>
      <SummaryBarChart
        greenIndicatorCount={5}
        redIndicatorCount={11}
        yellowIndicatorCount={2}
        skippedIndicatorCount={10}
        isAnimationActive={false}
      />
    </div>
  );
};

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  prioritiesAndAchievements: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(6)
  }
});

export default withStyles(styles)(OverviewBlock);
