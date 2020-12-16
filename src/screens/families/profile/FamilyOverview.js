import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MailIcon from '@material-ui/icons/Mail';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CountDetail from '../../../components/CountDetail';
import AllSurveyIndicators from '../../../components/summary/AllSurveyIndicators';
import SummaryDonut from '../../../components/summary/SummaryDonut';
import SummaryBarChart from '../../../components/SummaryBarChart';
import { getDateFormatByLocale } from '../../../utils/date-utils';

const useStyles = makeStyles(theme => ({
  basicInfoText: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '12%',
    paddingLeft: '12%'
  },
  subtitle: {
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    }
  },
  horizontalAlign: {
    display: 'flex',
    flexDirection: 'row'
  },
  iconGreen: {
    color: theme.palette.primary.main
  },
  iconGray: {
    color: theme.palette.grey.middle
  },
  labelGreen: {
    marginRight: 10,
    fontSize: 14,
    color: theme.palette.primary.main,
    paddingLeft: 10
  },

  lifemapContainer: {
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      alignItems: '100%!important'
    }
  },
  labelGreenRight: {
    marginRight: 20,
    marginBottom: 20,
    fontSize: 14,
    color: theme.palette.primary.main,
    paddingLeft: 10,
    paddingTop: 10,
    textAlign: 'right',
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center'
    }
  },
  indicators: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    order: 2,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      order: 3
    }
  },
  barchart: {
    order: 3,
    [theme.breakpoints.down('sm')]: {
      order: 2
    }
  }
}));

const FamilyOverview = ({
  family,
  firtsParticipant,
  stoplightSkipped,
  history
}) => {
  const classes = useStyles();
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const dateFormat = getDateFormatByLocale(language);

  const goToFamilyDetails = e => {
    history.push(`/detail/${family.familyId}`);
  };

  return (
    <Grid className={classes.basicInfoText} container>
      <Grid
        item
        md={12}
        container
        alignItems="center"
        style={{ flexDirection: 'column' }}
      >
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          {family ? family.name : ''}
        </Typography>
        <div className={classes.horizontalAlign}>
          <MailIcon className={classes.iconGreen} />
          {firtsParticipant && firtsParticipant.email ? (
            <a href={'mailto:' + firtsParticipant.email}>
              <Typography variant="subtitle1" className={classes.labelGreen}>
                {firtsParticipant.email}
              </Typography>
            </a>
          ) : (
            <Typography variant="subtitle1" className={classes.labelGreen}>
              --
            </Typography>
          )}
        </div>
        <div className={classes.horizontalAlign}>
          <PhoneInTalkIcon className={classes.iconGreen} />

          {firtsParticipant && firtsParticipant.phoneNumber ? (
            <a href={'tel:' + firtsParticipant.phoneNumber}>
              <Typography variant="subtitle1" className={classes.labelGreen}>
                {firtsParticipant.phoneNumber}
              </Typography>
            </a>
          ) : (
            <Typography variant="subtitle1" className={classes.labelGreen}>
              --
            </Typography>
          )}
        </div>
        <div className={classes.horizontalAlign}>
          <LocationOnIcon className={classes.iconGray} />
          <Typography variant="subtitle1" className={classes.label}>
            {family && family.country ? family.country.country : '--'}
          </Typography>
        </div>
      </Grid>

      <Grid item md={12} container style={{ marginTop: 8 }}>
        <Grid item md={6} container justify="center">
          <Typography variant="h5" className={classes.subtitle}>
            {t('views.familyProfile.lifemapNumber')}
            {family.numberOfSnapshots ? ' ' + family.numberOfSnapshots : 0}
          </Typography>
        </Grid>
        <Grid item md={6} container justify="center">
          <Typography variant="h5" className={classes.subtitle}>
            {family.snapshotIndicators
              ? `${moment(family.snapshotIndicators.createdAt).format(
                  dateFormat
                )}`
              : ''}
          </Typography>
        </Grid>
      </Grid>

      <Grid item md={6} sm={12} spacing={2} container justify="center">
        {!stoplightSkipped && (
          <React.Fragment>
            <Grid item md={4} xs={6} style={{ order: 1 }}>
              <SummaryDonut
                greenIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countGreenIndicators
                    : 0
                }
                redIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countRedIndicators
                    : 0
                }
                yellowIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countYellowIndicators
                    : 0
                }
                skippedIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countSkippedIndicators
                    : 0
                }
                isAnimationActive={true}
                countingSection={false}
                width="100%"
              />
            </Grid>
            <Grid item md={4} xs={6} className={classes.indicators}>
              <CountDetail
                type="priority"
                count={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countIndicatorsPriorities
                    : 0
                }
                label
                countVariant="h5"
              />
              <CountDetail
                type="achievement"
                count={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countIndicatorsAchievements
                    : 0
                }
                label
                countVariant="h5"
              />
            </Grid>
            <Grid item md={4} xs={6} className={classes.barchart}>
              <SummaryBarChart
                greenIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countGreenIndicators
                    : 0
                }
                redIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countRedIndicators
                    : 0
                }
                yellowIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countYellowIndicators
                    : 0
                }
                skippedIndicatorCount={
                  family.snapshotIndicators
                    ? family.snapshotIndicators.countSkippedIndicators
                    : 0
                }
                isAnimationActive={false}
                width="100%"
              />
            </Grid>
          </React.Fragment>
        )}
      </Grid>

      <Grid
        item
        md={6}
        xs={12}
        container
        justify="center"
        className={classes.lifemapContainer}
        style={{ width: stoplightSkipped ? '80%' : '40%' }}
      >
        <AllSurveyIndicators
          draft={family.snapshotIndicators ? family.snapshotIndicators : null}
        />

        {!stoplightSkipped && (
          <Typography variant="subtitle1" className={classes.labelGreenRight}>
            <Link onClick={goToFamilyDetails} style={{ cursor: 'pointer' }}>
              {t('views.familyProfile.viewLifeMap')}
            </Link>
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default FamilyOverview;
