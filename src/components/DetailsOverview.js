import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { getDateFormatByLocale } from '../utils/date-utils';
import { withSnackbar } from 'notistack';
import DimensionQuestion from './summary/DimensionQuestion';
import FamilyPriorities from './FamilyPriorities';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PrintIcon from '@material-ui/icons/Print';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import MailIcon from '@material-ui/icons/Mail';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

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
    justifyContent: 'center',
    paddingLeft: 30,
    paddingRight: 30
  }
}));

const DetailsOverview = ({ familyId, snapshot, pushIndicator }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const classes = useStyles();
  const dateFormat = getDateFormatByLocale(language);

  /** Props */
  const stoplightSkipped = false;
  const primaryParticipant = { name: 'Jorge ' };

  return (
    <div>
      <div className={classes.gridContainer}>
        {!stoplightSkipped && (
          <Grid container spacing={2} className={classes.buttonContainer}>
            {/* primaryParticipant.email */ true && (
              <Grid item xs={12} sm={3} style={{ margin: 'auto' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ margin: 'auto' }}
                  fullWidth
                  //disabled={this.state.loading}
                  onClick={() => {
                    this.handleMailClick(primaryParticipant.email);
                  }}
                >
                  <MailIcon className={classes.leftIcon} />
                  {t('views.final.email')}
                </Button>
              </Grid>
            )}

            {/* primaryParticipant.phoneNumber */ true && (
              <Grid item xs={12} sm={3} style={{ margin: 'auto' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  //disabled={this.state.loading}
                  onClick={() => {
                    /*  this.handleWhatsappClick(); */
                  }}
                >
                  <WhatsAppIcon className={classes.leftIcon} />
                  {t('views.final.whatsapp')}
                </Button>
              </Grid>
            )}

            <Grid item xs={12} sm={3} style={{ margin: 'auto' }}>
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
                  pdf.print(); */
                }}
              >
                <PrintIcon className={classes.leftIcon} />
                {t('views.final.print')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={3} style={{ margin: 'auto' }}>
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
        )}
      </div>
      <div className={classes.overviewContainer}>
        <DimensionQuestion
          questions={snapshot}
          previousIndicators={[]}
          previousPriorities={[]}
          previousAchivements={[]}
          priorities={[]}
          achievements={[]}
          history={[]}
          onClickIndicator={pushIndicator}
          isRetake={false}
        />
      </div>
      <FamilyPriorities
        familyId={familyId}
        stoplightSkipped={stoplightSkipped}
        questions={snapshot}
      ></FamilyPriorities>
    </div>
  );
};

export default withSnackbar(DetailsOverview);
