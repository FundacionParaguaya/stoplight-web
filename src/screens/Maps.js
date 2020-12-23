import React, { useState, useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { withStyles, CircularProgress } from '@material-ui/core/';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import withLayout from '../components/withLayout';
import MapsFilters from './maps/MapsFilters';
import { getSnapshots } from '../api';
import Map from './maps/Map';
import moment from 'moment';
import { getDateFormatByLocale } from '../utils/date-utils';
import { COLORS } from '../theme';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  mainBody: {
    display: 'flex',
    backgroundColor: theme.palette.primary.grey,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  filtersConatiner: {
    opacity: 1,
    padding: 20,
    paddingTop: 55,
    width: 330,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      padding: '0px 10px',
      paddingTop: 10
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 50,
    padding: 3
  },
  label: {
    marginRight: theme.spacing(1),
    fontSize: 14
  },
  loadingContainer: {
    zIndex: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  countContainer: {
    height: 55,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  countLabel: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: 'left',
    lineHeight: 1.2,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  messageIcon: {
    height: 40,
    width: 40,
    padding: 5,
    [theme.breakpoints.down('xs')]: {
      width: 35
    }
  },
  rootContainer: {
    width: 'calc((100% - 330px))',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  mapContainer: {
    height: '78vh',
    maxHeight: '78vh',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: '68vh',
      maxHeight: '68vh'
    }
  }
});

const Maps = ({ classes, user }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const dateFormat = getDateFormatByLocale(language);

  const [loading, setLoading] = useState(false);
  const [distinctFamilies, setDistinctFamilies] = useState(0);
  const [snapshots, setSnapshots] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [mapRenderId, setMapRenderId] = useState(0);

  const [filterInput, setFilterInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      hub: {},
      organizations: [],
      survey: {},
      facilitators: [],
      indicator: {},
      showClusters: true,
      colors: {
        green: true,
        yellow: true,
        red: true
      }
    }
  );

  useEffect(() => {
    setLoading(true);
    if (!!filterInput.survey && !!filterInput.survey.value) {
      getSnapshots(user, filtersPreProcessing(filterInput))
        .then(response => {
          const data = response.data.data.familiesSnapshot;
          const distinctFamilies = !!data.additionalData
            ? data.additionalData.distinctFamilies
            : 0;
          setDistinctFamilies(distinctFamilies);
          setSnapshots(data.content);
        })
        .finally(() => setLoading(false));
    } else {
      setDistinctFamilies(0);
      setSnapshots([]);
      setFilterInput({ indicator: {} });
      setMarkers([]);
      setLoading(false);
    }
  }, [filterInput.survey, filterInput.facilitators.length]);

  useEffect(() => {
    !!filterInput.indicator.value &&
      setMarkers(
        snapshots.map(family => {
          const indicator = family.stoplight.find(
            s => s.codeName === filterInput.indicator.value
          );
          return {
            coordinates: `${family.latitude},${family.longitude}`,
            color: !!indicator ? indicator.value : 0,
            householdID: family.id,
            household: family.familyName,
            householdCode: family.familyCode,
            date: moment
              .unix(family.snapshotDate)
              .utc()
              .format(dateFormat)
          };
        })
      );

    setMapRenderId(mapRenderId + 1);
  }, [snapshots, filterInput.indicator.value]);

  const filtersPreProcessing = filters => {
    //Pre-processing filters values
    let hubs = !!filters.hub && !!filters.hub.value ? [filters.hub] : [];
    hubs = hubs.map(h => h.value);
    let orgs = !filters.organizations.some(org => org.value === 'ALL')
      ? filters.organizations
      : [];
    orgs = orgs.map(o => o.value);
    const surveyUsers = filters.facilitators.map(f => f.value);

    return {
      ...filters,
      hubs,
      orgs,
      surveyUsers
    };
  };

  return (
    <div className={classes.mainBody}>
      {loading && (
        <div className={classes.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      <div className={classes.filtersConatiner}>
        <MapsFilters
          hubData={filterInput.hub}
          organizationsData={filterInput.organizations}
          surveyData={filterInput.survey}
          indicatorData={filterInput.indicator}
          facilitatorsData={filterInput.facilitators}
          colorsData={filterInput.colors}
          onChangeHub={hub =>
            setFilterInput({ hub, organizations: [], survey: {} })
          }
          onChangeOrganization={organizations =>
            setFilterInput({ organizations, survey: {} })
          }
          onChangeSurvey={survey => setFilterInput({ survey })}
          onChangeFacilitator={facilitators => setFilterInput({ facilitators })}
          onChangeIndicator={indicator => setFilterInput({ indicator })}
          onChangeColors={colors => setFilterInput({ colors })}
        />
      </div>
      <div className={classes.rootContainer}>
        <div
          className={classes.container}
          style={{ justifyContent: 'space-between' }}
        >
          <div
            className={classes.container}
            style={{ justifyContent: 'flex-start' }}
          >
            <InfoIcon
              className={classes.messageIcon}
              style={{ color: COLORS.GREEN }}
            />
            <Typography className={classes.countLabel} variant="h5">
              {distinctFamilies !== 0 ? (
                <span style={{ fontWeight: 600 }}>{distinctFamilies}</span>
              ) : (
                t('views.map.noRecords')
              )}
              {distinctFamilies === '1' && t('views.map.singleFamily')}
              {distinctFamilies > 1 && t('views.map.families')}
            </Typography>
          </div>
          <div className={classes.container}>
            <Typography variant="subtitle1" className={classes.label}>
              {t('views.map.filters.displayClusters')}
            </Typography>
            <Switch
              checked={filterInput.showClusters}
              onChange={() =>
                setFilterInput({ showClusters: !filterInput.showClusters })
              }
              color="primary"
            />
          </div>
        </div>
        <Map
          mapRenderId={mapRenderId}
          selectedColors={filterInput.colors}
          markers={markers}
          isMarkerShown={filterInput.showClusters}
          loadingElement={<div className={classes.mapContainer} />}
          containerElement={<div className={classes.mapContainer} />}
          mapElement={<div className={classes.mapContainer} />}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(withLayout(Maps)))
);
