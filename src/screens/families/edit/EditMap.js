import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { withSnackbar } from 'notistack';
import React, { useEffect, useReducer, useState } from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';
import { useTranslation } from 'react-i18next';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useParams } from 'react-router-dom';
import { updateLocation } from '../../../api';
import LocationIcon from '../../../assets/location.png';
import MarkerIcon from '../../../assets/marker.png';
import Container from '../../../components/Container';
import ExitModal from '../../../components/ExitModal';

const useStyles = makeStyles(() => ({
  inputContainer: {
    position: 'absolute',
    top: 127,
    left: 148,
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
  markerContainer: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    top: '50%'
  },
  markerIcon: {
    height: '43px',
    width: '35.7188px',
    position: 'absolute',
    userSelect: 'none',
    top: '-43px',
    left: '-17.85px',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none'
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
  buttonContainerForm: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 40
  },
  myLocationContainer: {
    right: 260,
    bottom: 250,
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

const EditMap = ({ history, enqueueSnackbar, closeSnackbar, user }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { familyId, latitude, longitude } = useParams();

  const google = window.google;

  const [loading, setLoading] = useState();
  const [openExitModal, setOpenExitModal] = useState(false);
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
    setLocationData({
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      initialLat: parseFloat(latitude),
      initialLng: parseFloat(longitude)
    });
  }, [latitude, longitude]);

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

  const handleContinue = () => {
    setLoading(true);
    updateLocation(user, familyId, locationData.lat, locationData.lng)
      .then(() => {
        enqueueSnackbar(t('views.familyProfile.form.save.success'), {
          variant: 'success',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
        history.push(`/family/${familyId}`);
      })
      .catch(e => {
        console.log(e);
        enqueueSnackbar(t('views.familyProfile.form.save.failed'), {
          variant: 'error',
          action: key => (
            <IconButton key="dismiss" onClick={() => closeSnackbar(key)}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          )
        });
      });
  };

  return (
    <Container variant="slim">
      <ExitModal
        open={openExitModal}
        onDissmiss={() => setOpenExitModal(false)}
        onClose={() => history.push(`/family/${familyId}`)}
      />
      <Prompt
        when={!openExitModal && !loading}
        message={t('views.exitModal.confirmText')}
      />
      <PlacesAutocomplete
        value={locationData.address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <React.Fragment>
            {!!locationData.initialLat && (
              <GoogleMap
                defaultZoom={16}
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
                    position: google.maps.ControlPosition.TOP_RIGHT
                  }
                }}
              >
                <div className={classes.markerContainer}>
                  <img src={MarkerIcon} className={classes.markerIcon} alt="" />
                </div>
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
      <div className={classes.buttonContainerForm}>
        <Button
          variant="outlined"
          onClick={() => {
            setOpenExitModal(true);
          }}
          disabled={loading}
        >
          {t('general.cancel')}
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          onClick={handleContinue}
          disabled={loading}
        >
          {t('general.save')}
        </Button>
      </div>
    </Container>
  );
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(withGoogleMap(withSnackbar(EditMap)));
