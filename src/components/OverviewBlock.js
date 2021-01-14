import React from 'react';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { Typography, Box } from '@material-ui/core';
import SummaryDonut from './summary/SummaryDonut';
import SummaryBarChart from './SummaryBarChart';
import CountDetail from './CountDetail';
import Divider from './Divider';
import Grid from '@material-ui/core/Grid';

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
    <Grid
      item
      md={12}
      xs={12}
      container
      spacing={2}
      className={classes.mainContainer}
    >
      <Grid item md={12} xs={12} style={{ order: 1 }}>
        <Typography variant="h5">
          {t('views.familiesOverviewBlock.stoplightOverview')}
        </Typography>
      </Grid>

      <Grid item md={4} xs={6} style={{ order: 2 }}>
        <SummaryDonut
          greenIndicatorCount={data.stoplightOverview.greens}
          redIndicatorCount={data.stoplightOverview.reds}
          yellowIndicatorCount={data.stoplightOverview.yellows}
          skippedIndicatorCount={data.stoplightOverview.skipped}
          isAnimationActive={false}
          countingSection={false}
          width="100%"
        />
      </Grid>
      <Grid item md={2} xs={4} className={classes.indicators}>
        <CountDetail
          type="priority"
          count={data.priorities}
          label
          countVariant="h4"
        />
        <Divider height={1} />
        <CountDetail
          type="achievement"
          count={data.achievements}
          label
          countVariant="h4"
        />
      </Grid>
      <Grid item md={5} xs={6} className={classes.barchart}>
        <SummaryBarChart
          greenIndicatorCount={data.stoplightOverview.greens}
          redIndicatorCount={data.stoplightOverview.reds}
          yellowIndicatorCount={data.stoplightOverview.yellows}
          skippedIndicatorCount={data.stoplightOverview.skipped}
          isAnimationActive={false}
          width="90%"
        />
      </Grid>
    </Grid>
  );
};

const styles = theme => ({
  mainContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    }
  },
  indicators: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    order: 3,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      order: 4
    }
  },
  barchart: {
    display: 'flex',
    justifyContent: 'flex-end',
    order: 4,
    [theme.breakpoints.down('sm')]: {
      order: 3
    }
  }
});

export default withTranslation()(withStyles(styles)(OverviewBlock));
