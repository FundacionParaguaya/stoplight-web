import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import coupleIcon from '../../assets/couple-icon.png';
import houseIcon from '../../assets/house.png';
import membersIcon from '../../assets/members-icon.png';
import SnapShotsFilters from '../../components/summary/SnapshotsFilter';
import CountriesChart from './CountriesChart';

const useStyles = makeStyles(theme => ({
  mainContainer: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.grey.middle,
    minHeight: 159,
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 20
    }
  },
  overviewTitleContainer: {
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },
  overviewTitle: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      textAlign: 'left',
      marginBottom: 8
    }
  },
  familiesCountStyle: {
    fontSize: 34,
    fontWeight: theme.typography.fontWeightMedium,
    [theme.breakpoints.down('xs')]: {
      fontSize: 25
    }
  },
  primaryLabel: {
    fontSize: 34,
    fontWeight: theme.typography.fontWeightMedium,
    width: '100%',
    textAlign: 'left',
    lineHeight: '0.85',
    [theme.breakpoints.down('sm')]: {
      fontSize: 20
    }
  },
  secondaryLabel: {
    alignSelf: 'flex-end',
    marginLeft: 5,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 5
    }
  },
  familyCountSecondLine: {
    alignSelf: 'flex-start',
    marginLeft: 5,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'left'
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: 5
    }
  },
  labelWithIcon: {
    fontSize: 34,
    fontWeight: theme.typography.fontWeightMedium,
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      fontSize: 20
    }
  },
  peopleCountStyle: {
    fontSize: 16,
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start'
    }
  },
  tooltip: {
    whiteSpace: 'pre-line'
  },
  expandIcon: {
    marginTop: 6
  },
  img: {
    maxWidth: 55,
    maxHeight: 55
  },
  coupleImg: {
    maxWidth: 62,
    maxHeight: 37
  },
  countContainer: {
    minHeight: 160,
    paddingTop: 13,
    [theme.breakpoints.down('xs')]: {
      minHeight: 140
    }
  },
  snapFilterContainer: {
    width: '40%',
    marginLeft: 10,
    maxWidth: '250px'
  },
  topCountriesLabel: {
    alignSelf: 'flex-end',
    marginLeft: 0,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 5,
      marginTop: 10
    }
  }
}));

const DashboardOverviewBlock = ({
  data,
  peopleByCountries,
  snapShotOptions,
  onFilterChanged,
  snapShotNumber
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [countriesCode, setCountriesCode] = useState([]);
  const [countriesCount, setCountriesCount] = useState([{}]);
  const [countriesTotal, setCountriesTotal] = useState();

  useEffect(() => {
    if (peopleByCountries.length > 0) {
      let names = peopleByCountries.map(country => country.country);
      setCountriesCode(names);
      let counts = [
        {
          name: 'data',
          first: !!peopleByCountries[0] && peopleByCountries[0].people,
          second: !!peopleByCountries[1] && peopleByCountries[1].people,
          third: !!peopleByCountries[2] && peopleByCountries[2].people
        }
      ];
      setCountriesCount(counts);
      let total = peopleByCountries.reduce((acc, x) => acc + x.people, 0);
      setCountriesTotal(total);
    }
  }, [peopleByCountries]);

  return (
    <Grid container spacing={2} className={classes.mainContainer}>
      <Grid
        item
        md={12}
        sm={12}
        xs={12}
        className={classes.overviewTitleContainer}
      >
        <Typography variant="h5" className={classes.overviewTitle}>
          {t('views.familiesOverviewBlock.overview')}
        </Typography>
        <SnapShotsFilters
          snapShotOptions={snapShotOptions}
          onFilterChanged={onFilterChanged}
          snapShotNumber={snapShotNumber}
        />
      </Grid>

      {/* First column */}
      <Grid item xl={4} lg={5} md={5} sm={6} xs={12} container spacing={2}>
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          container
          justify="flex-start"
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
              {data.familiesCount}
              <Typography
                component="span"
                variant="h6"
                className={classes.secondaryLabel}
              >
                {data.familiesCount !== 1
                  ? t('views.familiesOverviewBlock.families')
                  : t('views.familiesOverviewBlock.family')}
              </Typography>
            </Typography>
            <Typography className={classes.familyCountSecondLine} variant="h6">
              {`
                        ${t('views.familiesOverviewBlock.including')}
                        ${data.peopleCount} ${t(
                'views.familiesOverviewBlock.people'
              )}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          container
          spacing={1}
          className={classes.countContainer}
        >
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            container
            justify="flex-start"
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
              <img alt="members" src={membersIcon} className={classes.img} />
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
              <Typography
                component="p"
                variant="h5"
                className={classes.primaryLabel}
                style={{ marginTop: 20 }}
              >
                {Math.round(data.membersAverage * 10) / 10}
                <Typography
                  component="span"
                  variant="h6"
                  className={classes.secondaryLabel}
                >
                  {t('views.familiesOverviewBlock.averageMembers')}
                </Typography>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Second column */}
      <Grid item md={4} sm={6} xs={12} container spacing={2}>
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          container
          spacing={2}
          style={{ maxHeight: 160 }}
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
            <img alt="gender" src={coupleIcon} className={classes.coupleImg} />
          </Grid>
          <Grid
            item
            xl={10}
            lg={9}
            md={8}
            sm={8}
            xs={8}
            container
            justify="flex-start"
          >
            <Typography
              component="p"
              variant="h5"
              className={classes.primaryLabel}
            >
              {data.genders.male}
              <Typography
                component="span"
                variant="h6"
                className={classes.secondaryLabel}
              >
                {t('views.familiesOverviewBlock.men')}
              </Typography>
            </Typography>
            <Typography
              component="p"
              variant="h5"
              className={classes.primaryLabel}
            >
              {data.genders.female}
              <Typography
                component="span"
                variant="h6"
                className={classes.secondaryLabel}
              >
                {t('views.familiesOverviewBlock.women')}
              </Typography>
            </Typography>
            <Tooltip
              title={data.genders.otherTooltipText}
              aria-label="other"
              classes={{ tooltip: classes.tooltip }}
              placement="bottom-start"
            >
              <Typography
                component="p"
                variant="h5"
                className={classes.primaryLabel}
              >
                {data.genders.otherGendersCount}
                <Typography
                  component="span"
                  variant="h6"
                  className={classes.secondaryLabel}
                >
                  {t('views.familiesOverviewBlock.other')}
                </Typography>
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>

      {/* Third column */}
      <Grid item md={3} sm={5} xs={12} container spacing={2}>
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          container
          spacing={2}
          style={{ maxHeight: 160 }}
        >
          <Typography
            component="span"
            variant="h5"
            className={classes.topCountriesLabel}
          >
            {t('views.familiesOverviewBlock.topCountries')}
          </Typography>
          <CountriesChart
            countriesCode={countriesCode}
            countriesCount={countriesCount}
            countriesTotal={countriesTotal}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardOverviewBlock;
