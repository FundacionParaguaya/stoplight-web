import React, { useEffect, useState, useReducer } from 'react';
import { connect } from 'react-redux';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import green from '../../assets/green-dot.svg';
import yellow from '../../assets/yellow-dot.svg';
import red from '../../assets/red-dot.svg';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/';
import { useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ROLES_NAMES } from '../../utils/role-utils';

const styles = () => ({
  inputContainer: {
    position: 'absolute',
    top: 150,
    left: 340,
    width: '40%',
    zIndex: 1
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: 'white'
  },
  suggestionsTypography: {
    fontSize: 14
  },
  infoWindow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '8vh',
    padding: 5
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  inputRoot: {
    marginLeft: 8,
    flex: 1,
    fontSize: '14px'
  },
  inputBase: {
    padding: '1px !important'
  },
  iconButton: {
    padding: 10
  },
  suggestionsPaper: {
    padding: '2px 4px',
    backgroundColor: 'white'
  },
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40
  }
});

const Map = ({
  classes,
  mapRenderId,
  markers,
  isMarkerShown,
  selectedColors,
  user
}) => {
  const { t } = useTranslation();

  const google = window.google;

  const [marks, setMarks] = useState([]);
  const [showInfoData, setShowInfoData] = useState({
    showInfo: false,
    showInfoIndex: null
  });
  const [locationData, setLocationData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      lat: '',
      lng: '',
      address: '',
      initialLat: '',
      initialLng: ''
    }
  );

  useEffect(() => {
    locateMe();
  }, []);

  useEffect(() => {
    setMarks(markers.sort((a, b) => a.householdID - b.householdID));
  }, [mapRenderId, isMarkerShown]);

  const toggleInfo = i => {
    setShowInfoData({ showInfo: !showInfoData.showInfo, showInfoIndex: i });
  };

  const handleChange = address => {
    setLocationData({ address });
  };

  const handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        setLocationData({
          lat: latLng.lat,
          lng: latLng.lng,
          address,
          initialLat: latLng.lat,
          initialLng: latLng.lng
        });
      })
      .catch(e => console.error(e));
  };

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(position => {
      setLocationData({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        initialLat: position.coords.latitude,
        initialLng: position.coords.longitude
      });
    });
  };

  const showColor = color => {
    if (color === 1 && selectedColors.red) return red;
    if (color === 2 && selectedColors.yellow) return yellow;
    if (color === 3 && selectedColors.green) return green;

    return false;
  };

  const isPsteam = ({ role }) => role === ROLES_NAMES.ROLE_PS_TEAM;

  return (
    <PlacesAutocomplete
      value={locationData.address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <React.Fragment>
          {!!locationData.initialLat && (
            <GoogleMap
              defaultZoom={6}
              defaultCenter={{
                lat: locationData.initialLat,
                lng: locationData.initialLng
              }}
              options={{
                mapTypeControlOptions: {
                  position: google.maps.ControlPosition.TOP_RIGHT
                }
              }}
            >
              {!!isMarkerShown ? (
                <MarkerClusterer
                  averageCenter
                  minimumClusterSize={50}
                  defaultMinimumClusterSize={50}
                  ignoreHidden={true}
                  gridSize={50}
                  styles={[
                    {
                      url:
                        'https://fp-psp-images.s3.us-east-2.amazonaws.com/stoplight-images/m1.png',
                      height: 53,
                      lineHeight: 53,
                      width: 53,
                      textColor: 'white',
                      visibility: 'hidden'
                    },
                    {
                      url:
                        'https://fp-psp-images.s3.us-east-2.amazonaws.com/stoplight-images/m2.png',
                      height: 56,
                      lineHeight: 56,
                      width: 56,
                      textColor: 'green',
                      visibility: 'hidden'
                    },
                    {
                      url:
                        'https://fp-psp-images.s3.us-east-2.amazonaws.com/stoplight-images/m3.png',
                      height: 66,
                      lineHeight: 66,
                      width: 66,
                      textColor: 'orange',
                      visibility: 'hidden'
                    },
                    {
                      url:
                        'https://fp-psp-images.s3.us-east-2.amazonaws.com/stoplight-images/m4.png',
                      height: 78,
                      lineHeight: 78,
                      width: 78,
                      textColor: 'black'
                    },
                    {
                      url:
                        'https://fp-psp-images.s3.us-east-2.amazonaws.com/stoplight-images/m5.png',
                      height: 90,
                      lineHeight: 90,
                      width: 90,
                      textColor: 'white'
                    }
                  ]}
                >
                  {marks.length > 0 &&
                    marks
                      .filter(
                        marker => marker.coordinates && showColor(marker.color)
                      )
                      .map((marker, i) => (
                        <Marker
                          key={marker.householdID}
                          icon={showColor(marker.color)}
                          position={{
                            lat: Number(marker.coordinates.split(',')[0]),
                            lng: Number(marker.coordinates.split(',')[1])
                          }}
                          onClick={() => {
                            toggleInfo(i);
                          }}
                        >
                          {showInfoData.showInfo &&
                            showInfoData.showInfoIndex === i && (
                              <InfoWindow onCloseClick={toggleInfo}>
                                <div className={classes.infoWindow}>
                                  <Typography
                                    variant="h5"
                                    style={{ fontSize: 16 }}
                                  >
                                    {isPsteam(user)
                                      ? marker.householdCode
                                      : marker.household}
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    style={{ fontSize: 14 }}
                                  >
                                    {marker.date}
                                  </Typography>
                                </div>
                              </InfoWindow>
                            )}
                        </Marker>
                      ))}
                </MarkerClusterer>
              ) : (
                <React.Fragment>
                  {marks.length > 0 &&
                    marks
                      .filter(
                        marker => marker.coordinates && showColor(marker.color)
                      )
                      .map((marker, i) => (
                        <Marker
                          key={marker.householdID}
                          icon={showColor(marker.color)}
                          position={{
                            lat: Number(marker.coordinates.split(',')[0]),
                            lng: Number(marker.coordinates.split(',')[1])
                          }}
                          onClick={() => {
                            toggleInfo(i);
                          }}
                        >
                          {showInfoData.showInfo &&
                            showInfoData.showInfoIndex === i && (
                              <InfoWindow onCloseClick={toggleInfo}>
                                <div className={classes.infoWindow}>
                                  <Typography
                                    variant="h5"
                                    style={{ fontSize: 16 }}
                                  >
                                    {isPsteam(user)
                                      ? marker.householdCode
                                      : marker.household}
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    style={{ fontSize: 14 }}
                                  >
                                    {marker.date}
                                  </Typography>
                                </div>
                              </InfoWindow>
                            )}
                        </Marker>
                      ))}
                </React.Fragment>
              )}
              <div className={classes.inputContainer}>
                <Paper className={classes.root} elevation={1}>
                  <IconButton
                    disabled
                    className={classes.iconButton}
                    aria-label="Search"
                  >
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputBase
                    }}
                    {...getInputProps({
                      placeholder: t('views.location.searchBoxPlaceholder')
                    })}
                  />
                </Paper>
                <div className={classes.suggestionsContainer}>
                  {loading && (
                    <List>
                      <ListItem>
                        <ListItemText
                          primary={t('views.location.loadingOptionsLabel')}
                          primaryTypographyProps={{
                            className: classes.suggestionsTypography
                          }}
                        />
                      </ListItem>
                    </List>
                  )}
                  {!loading && suggestions && suggestions.length > 0 && (
                    <List>
                      {suggestions.map(suggestion => {
                        return (
                          <ListItem key={suggestion.description}>
                            <div {...getSuggestionItemProps(suggestion)}>
                              <ListItemText
                                primary={suggestion.description}
                                primaryTypographyProps={{
                                  className: classes.suggestionsTypography
                                }}
                              />
                            </div>
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </div>
              </div>
            </GoogleMap>
          )}
        </React.Fragment>
      )}
    </PlacesAutocomplete>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default withStyles(styles)(connect(mapStateToProps)(withGoogleMap(Map)));
