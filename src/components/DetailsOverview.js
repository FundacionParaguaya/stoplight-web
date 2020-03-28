import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getDateFormatByLocale } from '../utils/date-utils';
import { withSnackbar } from 'notistack';
import DimensionQuestion from './summary/DimensionQuestion';
import FamilyPriorities from './FamilyPriorities';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import MailIcon from '@material-ui/icons/Mail';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  overviewContainer: {
    padding: '25px',
    paddingBottom: 0,
    backgroundColor: theme.palette.background.default
  },
  gridContainer: {
    height: 80,
    backgroundColor: theme.palette.background.default
  },
  buttonContainer: {
    height: 80,
    display: 'flex',
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  mainContainer: {
    paddingLeft: '12%',
    paddingRight: '12%',
    backgroundColor: theme.palette.background.default
  },
  headerContainer: {
    display: 'inline-flex',
    width: '100%',
    height: 190
  },
  textContainter: {
    margin: 'auto',
    height: 60,
    width: '50%'
  },
  labelContainer: {
    width: '100%',
    display: 'flex'
  },
  mainLabel: {
    fontWeight: 600,
    width: 'auto'
  }
}));

const DetailsOverview = ({
  familyId,
  family,
  mentor,
  index,
  snapshot,
  firstParticipant
}) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const dateFormat = getDateFormatByLocale(language);
  const [stoplight, setStoplight] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    snapshot.achievements && setAchievements(snapshot.achievements);
    snapshot.priorities && setPriorities(snapshot.priorities);
    let stoplight = snapshot.stoplight.map(snapshotStoplight => {
      return {
        key: snapshotStoplight.codeName,
        value: snapshotStoplight.value,
        questionText: snapshotStoplight.shortName
      };
    });
    setStoplight(stoplight);
  }, []);

  return (
    <div className={classes.mainContainer}>
      <div className={classes.headerContainer}>
        <div className={classes.textContainter}>
          <Typography variant="h5">
            {`${t('views.familyProfile.stoplight')} ${index + 1}`}
          </Typography>
          <div
            className={classes.labelContainer}
            style={{ justifyContent: 'flex-start' }}
          >
            <Typography variant="h6" style={{ width: 'auto' }}>
              {`${t('views.familyProfile.mentor')}: `}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h6" className={classes.mainLabel}>
              {mentor.label}
            </Typography>
          </div>
        </div>
        <div className={classes.textContainter} style={{ textAlign: 'right' }}>
          <Typography variant="h5">
            {`${moment
              .unix(snapshot.snapshotDate)
              .utc()
              .format(dateFormat)}`}
          </Typography>
          <div
            className={classes.labelContainer}
            style={{ justifyContent: 'flex-end' }}
          >
            <Typography variant="h6" style={{ width: 'auto' }}>
              {`${t('views.familyProfile.organization')} `}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h6" className={classes.mainLabel}>
              {family.organization.name}
            </Typography>
          </div>
        </div>
      </div>

      <div className={classes.gridContainer}>
        <Grid container spacing={4} className={classes.buttonContainer}>
          {firstParticipant.email && (
            <Grid item xs={12} sm={4} style={{ margin: 'auto' }}>
              <Button
                variant="outlined"
                color="primary"
                style={{ margin: 'auto' }}
                fullWidth
                //disabled={this.state.loading}
                onClick={() => {
                  /*  this.handleMailClick(firstParticipant.email); */
                }}
              >
                <MailIcon className={classes.leftIcon} />
                {t('views.final.email')}
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm={4} style={{ margin: 'auto' }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              //disabled={this.state.loading}
              onClick={() => {
                /*  const pdf = generateIndicatorsReport(
                  this.props.currentDraft,
                  this.props.currentSurvey,
                  t,
                  language
                );
                pdf.download(getReportTitle(this.props.currentDraft, t)); */
              }}
            >
              <DownloadIcon className={classes.leftIcon} />
              {t('views.final.download')}
            </Button>
          </Grid>
        </Grid>
      </div>
      <div className={classes.overviewContainer}>
        <DimensionQuestion
          questions={stoplight}
          priorities={priorities}
          achievements={achievements}
          isRetake={false}
        />
      </div>
      <FamilyPriorities
        familyId={familyId}
        stoplightSkipped={true}
        questions={snapshot}
      ></FamilyPriorities>
    </div>
  );
};

export default withSnackbar(DetailsOverview);
