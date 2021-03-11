import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem } from 'react-sanfona';
import houseIcon from '../../assets/house.png';
import stoplightIcon from '../../assets/stoplight-icon.png';

const useStyles = makeStyles(theme => ({
  familiesCountStyle: {
    fontSize: 34,
    fontWeight: theme.typography.fontWeightMedium
  },
  primaryLabel: {
    fontSize: 34,
    fontWeight: theme.typography.fontWeightMedium,
    width: '100%',
    textAlign: 'left'
  },
  secondaryLabel: {
    alignSelf: 'flex-end',
    marginLeft: 5,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 5
    }
  },
  labelWithIcon: {
    fontSize: 34,
    fontWeight: theme.typography.fontWeightMedium,
    display: 'flex',
    flexWrap: 'wrap'
  },
  expandIcon: {
    marginTop: 6
  },
  img: {
    maxWidth: 55,
    maxHeight: 55,
    marginRight: 20
  },
  familiesTotal: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 50,
    alignItems: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      marginRight: 0
    }
  },
  gripItemLeft: {
    justifyContent: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start'
    }
  },
  gripItemRight: {
    justifyContent: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-start'
    }
  },
  mainContainer: {
    minHeight: 140,
    alignContent: 'center',
    justifyContent: 'center',
    placeContent: 'start',
    paddingTop: 44,
    [theme.breakpoints.down('sm')]: {
      paddingTop: 10
    }
  }
}));

const DashboardGeneralData = ({ data }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const totalFamilies = data.familiesCount;
  const stoplights = data.snapshotsCount;
  const baselineSurveys = data.snapshotsCount - data.followupsCount;
  const followUpSurveys = data.followupsCount;
  const onlySocioEconomic = data.snaspshotsWithoutStoplight;

  const [expandData, setExpandData] = useState(false);
  return (
    <>
      <Grid container spacing={2} className={classes.mainContainer}>
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          container
          spacing={2}
          style={{ maxWidth: '100%', flexBasis: '100%' }}
        >
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={12}
            xs={12}
            container
            justify="center"
            spacing={1}
            style={{ minHeight: 113, maxHeight: 113 }}
          >
            <Grid
              item
              xl={2}
              lg={3}
              md={4}
              sm={4}
              xs={4}
              container
              justify="center"
            >
              <img alt="house" src={houseIcon} className={classes.img} />
            </Grid>
            <Grid
              item
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={8}
              container
              justify="flex-start"
              alignItems="flex-start"
              direction="column"
            >
              <Typography
                component="p"
                variant="h4"
                className={classes.familiesCountStyle}
              >
                {totalFamilies}
                <Typography
                  component="span"
                  variant="h6"
                  className={classes.secondaryLabel}
                >
                  {totalFamilies !== 1
                    ? t('views.familiesOverviewBlock.families')
                    : t('views.familiesOverviewBlock.family')}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={12}
            xs={12}
            container
            justify="center"
          >
            <Grid
              item
              xl={2}
              lg={3}
              md={4}
              sm={4}
              xs={4}
              container
              justify="center"
            >
              <img
                alt="stoplight"
                src={stoplightIcon}
                className={classes.img}
              />
            </Grid>
            <Grid
              item
              xl={8}
              lg={8}
              md={8}
              sm={8}
              xs={8}
              container
              justify="flex-start"
            >
              <Accordion style={{ paddingTop: 7 }}>
                <AccordionItem
                  onExpand={() => setExpandData(!expandData)}
                  onClose={() => setExpandData(!expandData)}
                  title={
                    <Typography variant="h5" className={classes.labelWithIcon}>
                      {stoplights}
                      <Typography
                        component="span"
                        variant="h6"
                        className={classes.secondaryLabel}
                        style={{ marginBottom: 3, paddingTop: 10 }}
                      >
                        {stoplights !== 1
                          ? t('views.familiesOverviewBlock.tookSnapshots')
                          : t('views.familiesOverviewBlock.tookSnapshot')}
                      </Typography>
                      {!expandData ? (
                        <KeyboardArrowDown
                          style={{ paddingTop: 10 }}
                          className={classes.expandIcon}
                        />
                      ) : (
                        <KeyboardArrowUp
                          style={{ paddingTop: 10 }}
                          className={classes.expandIcon}
                        />
                      )}
                    </Typography>
                  }
                >
                  <React.Fragment>
                    <Typography
                      component="p"
                      variant="h5"
                      className={classes.primaryLabel}
                      style={{ fontSize: 22 }}
                    >
                      {baselineSurveys}
                      <Typography
                        component="span"
                        variant="h6"
                        className={classes.secondaryLabel}
                      >
                        {t('views.familiesOverviewBlock.baseLine')}
                      </Typography>
                    </Typography>
                    {!!followUpSurveys && (
                      <Typography
                        component="p"
                        variant="h5"
                        className={classes.primaryLabel}
                        style={{ fontSize: 22 }}
                      >
                        {followUpSurveys}
                        <Typography
                          component="span"
                          variant="h6"
                          className={classes.secondaryLabel}
                        >
                          {t('views.familiesOverviewBlock.followUp')}
                        </Typography>
                      </Typography>
                    )}
                    {onlySocioEconomic !== 0 && (
                      <Typography
                        component="p"
                        variant="h5"
                        className={classes.primaryLabel}
                        style={{ fontSize: 22 }}
                      >
                        {onlySocioEconomic}
                        <Typography
                          component="span"
                          variant="h6"
                          className={classes.secondaryLabel}
                        >
                          {t(
                            'views.familiesOverviewBlock.tookWhitoutStoplight'
                          )}
                        </Typography>
                      </Typography>
                    )}
                  </React.Fragment>
                </AccordionItem>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardGeneralData;
