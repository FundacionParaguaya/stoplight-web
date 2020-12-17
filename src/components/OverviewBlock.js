import React from 'react';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Box } from '@material-ui/core';
import SummaryDonut from './summary/SummaryDonut';
import SummaryBarChart from './SummaryBarChart';
import CountDetail from './CountDetail';
import Divider from './Divider';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Tooltip from '@material-ui/core/Tooltip';

const OverviewBlock = ({ classes, data, t, width, handleOnClick }) => {
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
      <div className={classes.mainContainer} style={{ width }}>
        <Typography variant="h5">
          {t('views.familiesOverviewBlock.overview')}
        </Typography>
        <Box mt={2} />
        <Typography>{t('views.organizationsFilter.noMatchFilters')}</Typography>
      </div>
    );
  }

  return (
    <div className={classes.mainContainer} style={{ width }}>
      <Typography variant="h5">
        {t('views.familiesOverviewBlock.overview')}
      </Typography>
      <div className={classes.container}>
        <SummaryDonut
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
        <SummaryBarChart
          greenIndicatorCount={data.stoplightOverview.greens}
          redIndicatorCount={data.stoplightOverview.reds}
          yellowIndicatorCount={data.stoplightOverview.yellows}
          skippedIndicatorCount={data.stoplightOverview.skipped}
          isAnimationActive={false}
          width="40%"
        />
        <Tooltip title={t('views.familiesOverviewBlock.download')}>
          <CloudDownloadIcon
            color="primary"
            className={classes.icon}
            onClick={handleOnClick}
          />
        </Tooltip>
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
  },
  icon: {
    alignSelf: 'flex-start',
    cursor: 'pointer'
  }
});

export default withTranslation()(withStyles(styles)(OverviewBlock));
