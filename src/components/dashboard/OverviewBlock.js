import React from 'react';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import DonutChart from '../DonutChart';
import BarChart from '../BarChart';
import CountDetail from '../CountDetail';
import Divider from '../Divider';

const OverviewBlock = ({ classes, data, t, width }) => {
  if (
    !data ||
    (data &&
      data.achievements === 0 &&
      data.priorities === 0 &&
      data.stoplightOverview.greens === 0 &&
      data.stoplightOverview.yellows === 0 &&
      data.stoplightOverview.reds === 0 &&
      data.stoplightOverview.skipped === 0)
  ) {
    return (
      <Typography>{t('views.organizationsFilter.noMatchFilters')}</Typography>
    );
  }

  return (
    <div className={classes.mainContainer} style={{ width }}>
      <Typography variant="h5">
        {t('views.familiesOverviewBlock.overview')}
      </Typography>
      <div className={classes.container}>
        <DonutChart
          greenIndicatorCount={data.stoplightOverview.greens}
          redIndicatorCount={data.stoplightOverview.reds}
          yellowIndicatorCount={data.stoplightOverview.yellows}
          skippedIndicatorCount={data.stoplightOverview.skipped}
          isAnimationActive={false}
          countingSection={false}
          width="35%"
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
        <BarChart
          greenIndicatorCount={data.stoplightOverview.greens}
          redIndicatorCount={data.stoplightOverview.reds}
          yellowIndicatorCount={data.stoplightOverview.yellows}
          skippedIndicatorCount={data.stoplightOverview.skipped}
          isAnimationActive={false}
          width="40%"
        />
      </div>
    </div>
  );
};

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  prioritiesAndAchievements: {
    width: '25%'
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      width: '100%!important'
    }
  }
});

export default withTranslation()(withStyles(styles)(OverviewBlock));
