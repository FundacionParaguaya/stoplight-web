import React, { useState, useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles, CircularProgress } from '@material-ui/core/';
import withLayout from '../components/withLayout';
import MapsFilters from './maps/MapsFilters';
import { getSnapshots, GOOGLEKEY } from '../api';
import Map from './maps/Map';

const styles = theme => ({
  mainBody: {
    display: 'flex',
    backgroundColor: theme.palette.background.default
  },
  filtersConatiner: {
    opacity: 1,
    backgroundColor: '#f3f4f687',
    padding: 20,
    paddingTop: 35,
    width: 400,
    height: '88vh'
  },
  loadingContainer: {
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    backgroundColor: theme.palette.text.light,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  }
});

const Maps = ({ classes, user }) => {
  const [loading, setLoading] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [markers, setMarkers] = useState([]);

  const [filterInput, setFilterInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      hub: {},
      organizations: [],
      survey: {},
      fromDate: null,
      toDate: null,
      // Advanced filters
      facilitators: [],
      indicator: {},
      colors: {
        green: true,
        yellow: true,
        red: true
      },
      text: ''
    }
  );

  useEffect(() => {
    setLoading(true);
    getSnapshots(user)
      .then(response => setSnapshots(response.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log(snapshots);
    snapshots.length > 0 &&
      !!filterInput.indicator.value &&
      setMarkers(
        snapshots.map(item => ({
          coordinates: `${item.family.latitude},${item.family.longitude}`,
          color: item.indicator_survey_data[filterInput.indicator.value],
          householdID: item.family.familyId,
          household: item.family.name,
          date: item.created_at
        }))
      );
  }, [snapshots, filterInput.indicator]);

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
          onChangeFacilitator={facilitators => {
            setFilterInput({ facilitators });
          }}
          onChangeIndicator={indicator => {
            setFilterInput({ indicator });
          }}
          onChangeColors={colors => setFilterInput({ colors })}
          onChangeText={text => setFilterInput({ text })}
        />
      </div>
      <div style={{ width: 'calc((100% - 400px))' }}>
        <Map
          selectedColors={['GREEN', 'YELLOW', 'RED']}
          markers={markers}
          isMarkerShown
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLEKEY}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `600px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  withStyles(styles)(connect(mapStateToProps)(withLayout(Maps)))
);
