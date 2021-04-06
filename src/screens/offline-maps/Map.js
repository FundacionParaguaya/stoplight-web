import { IconButton } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useReducer } from 'react';
import { GoogleMap, withGoogleMap, Rectangle } from 'react-google-maps';
import { useTranslation } from 'react-i18next';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import LocationIcon from '../../assets/location.png';
import { useWindowSize } from '../../utils/hooks-helpers';

const useStyles = makeStyles(theme => ({
  inputContainer: {
    position: 'absolute',
    top: 42,
    left: 10,
    width: '80%',
    maxWidth: 300,
    zIndex: 1,
    [theme.breakpoints.down('xs')]: {
      width: '95%'
    }
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: 'white'
  },
  suggestionsTypography: {
    fontSize: 14
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
  myLocationContainer: {
    right: 55,
    bottom: 280,
    position: 'absolute',
    zIndex: 1
  },
  myLocationIcon: {
    height: '50px',
    width: '50px',
    position: 'absolute',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none'
  }
}));

const Map = ({ open, setArea, mapToEdit }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const isEdit = !!mapToEdit && !!mapToEdit.id;
  const windowSize = useWindowSize();
  const google = window.google;
  const {
    DrawingManager
  } = require('react-google-maps/lib/components/drawing/DrawingManager');

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

  function onDragEnd() {
    let center = this.getCenter();
    setLocationData({
      lat: center.lat(),
      lng: center.lng(),
      initialLat: center.lat(),
      initialLng: center.lng()
    });
  }

  useEffect(() => {
    open && locateMe();
  }, [open]);

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
              defaultZoom={12}
              defaultCenter={{
                lat: locationData.lat,
                lng: locationData.lng
              }}
              center={{
                lat: locationData.lat,
                lng: locationData.lng
              }}
              onDragEnd={onDragEnd}
              options={{
                mapTypeControlOptions: {
                  position:
                    windowSize.width > 650
                      ? google.maps.ControlPosition.TOP_RIGHT
                      : 'hidden'
                },
                streetViewControlOptions: {
                  position: 'hidden'
                }
              }}
            >
              {isEdit && (
                <Rectangle
                  bounds={
                    new google.maps.LatLngBounds(
                      new google.maps.LatLng(-26.425988, -57.144319),
                      new google.maps.LatLng(-26.401082, -57.090417)
                    )
                  }
                  key={1}
                  editable={true}
                  options={{
                    strokeColor: '#000000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#000000',
                    fillOpacity: 0.35
                  }}
                />
              )}
              <DrawingManager
                defaultOptions={{
                  drawingControl: !isEdit ? true : false,
                  drawingMode: !isEdit
                    ? google.maps.drawing.OverlayType.RECTANGLE
                    : null,
                  drawingControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position:
                      windowSize.width > 650
                        ? google.maps.ControlPosition.TOP_CENTER
                        : google.maps.ControlPosition.LEFT_CENTER,
                    drawingModes: [
                      !isEdit ? google.maps.drawing.OverlayType.RECTANGLE : null
                    ]
                  }
                }}
                onRectangleComplete={area => setArea(area)}
              />

              <div className={classes.myLocationContainer} onClick={locateMe}>
                <img
                  src={LocationIcon}
                  className={classes.myLocationIcon}
                  alt=""
                />
              </div>
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

export default withGoogleMap(Map);
