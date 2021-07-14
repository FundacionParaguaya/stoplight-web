import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withTranslation } from 'react-i18next';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { Gmaps } from 'react-gmaps';
import Geocode from 'react-geocode';
import { updateDraft } from '../../redux/actions';
import TitleBar from '../../components/TitleBar';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import LocationIcon from '../../assets/location.png';
import MarkerIcon from '../../assets/marker.png';

const params = { v: '3.exp', key: process.env.REACT_APP_MAP_API_KEY || '' };
Geocode.setApiKey(params.key);

class Location extends Component {
  state = {
    address: '',
    lat: '',
    lng: '',
    moved: false
  };

  handleContinue = () => {
    // validation happens here
    if (
      this.props.currentSurvey.economicScreens.questionsPerScreen.length <= 0
    ) {
      this.props.history.push('/lifemap/begin-stoplight');
    } else {
      this.props.history.push('/lifemap/economics/0');
    }
  };

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    const { currentDraft } = this.props;
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          lat: latLng.lat,
          lng: latLng.lng,
          address,
          initialLat: latLng.lat,
          initialLng: latLng.lng
        });
        this.props.updateDraft({
          ...currentDraft,
          familyData: {
            ...currentDraft.familyData,
            latitude: latLng.lat,
            longitude: latLng.lng
          }
        });
        Location.getCountryFromLatLng(latLng.lat, latLng.lng).then(
          c => !!c && this.updateDraft('country', c)
        );
      })
      .catch(() => {});
  };

  updateDraft = (field, value) => {
    const { currentDraft } = this.props;
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,

        [field]: value
      }
    });
  };

  static getCountryFromLatLng = async (lat, lng) => {
    let country = null;
    try {
      const { results } = await Geocode.fromLatLng(lat, lng);
      if (results && results.length > 0) {
        const r = results.find(result => result.types.includes('country'));
        if (r) {
          country = r.address_components[0].short_name;
        }
      }
    } catch (e) {
      country = '';
    }

    return country;
  };

  onDragMapEnded = () => {
    const { currentDraft } = this.props;
    const lat = this.map.center.lat();
    const lng = this.map.center.lng();
    // Update the state
    this.setState({
      lat,
      lng,
      moved: true
    });

    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        latitude: lat,
        longitude: lng
      }
    });

    // Using geoloc to find country
    Location.getCountryFromLatLng(lat, lng).then(
      c => !!c && this.updateDraft('country', c)
    );
  };

  onMapCreated = map => {
    this.map = map;
  };

  locateMe = () => {
    const { currentDraft, currentSurvey } = this.props;
    const surveyLocation = currentSurvey.surveyConfig.surveyLocation;
    this.setState(
      {
        initialLat: surveyLocation.latitude,
        initialLng: surveyLocation.longitude,
        lat: surveyLocation.latitude,
        lng: surveyLocation.longitude
      },
      () =>
        navigator.geolocation.getCurrentPosition(position => {
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            initialLat: position.coords.latitude,
            initialLng: position.coords.longitude
          });
          this.props.updateDraft({
            ...currentDraft,
            familyData: {
              ...currentDraft.familyData,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          });
          Location.getCountryFromLatLng(
            position.coords.latitude,
            position.coords.longitude
          ).then(c => !!c && this.updateDraft('country', c));
        })
    );
  };

  componentDidMount = async () => {
    const { currentDraft } = this.props;
    // get user location happens here

    if (!currentDraft.familyData.latitude) {
      this.locateMe();
    } else {
      this.setState({
        lat: currentDraft.familyData.latitude,
        lng: currentDraft.familyData.longitude,
        initialLat: currentDraft.familyData.latitude,
        initialLng: currentDraft.familyData.longitude
      });
    }
  };

  render() {
    const { t, classes, currentDraft } = this.props;
    const { familyData = {} } = currentDraft;

    return (
      <div>
        <TitleBar title={t('views.location.title')} progressBar />
        <Container variant="stretch">
          {/* Map */}
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            onError={e => {}} //To avoid throwing errors if suggestions list it's empty
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading
            }) => (
              <div className={classes.mapContainer}>
                <Gmaps
                  height="65vh"
                  lat={this.state.initialLat}
                  lng={this.state.initialLng}
                  zoom={12}
                  loadingMessage={t('views.location.mapLoading')}
                  params={params}
                  scrollwheel={false}
                  onMapCreated={this.onMapCreated}
                  onDragEnd={this.onDragMapEnded}
                  disableDefaultUI
                  zoomControl
                >
                  <div className={classes.markerContainer}>
                    <img
                      src={MarkerIcon}
                      className={classes.markerIcon}
                      alt=""
                    />
                  </div>
                  <div
                    className={classes.myLocationContainer}
                    onClick={this.locateMe}
                  >
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
                </Gmaps>
              </div>
            )}
          </PlacesAutocomplete>

          {/* Map End */}

          <div className={classes.buttonContainerForm}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              test-id="continue"
              disabled={
                !familyData.latitude ||
                !familyData.longitude ||
                !familyData.country
              }
              onClick={this.handleContinue}
            >
              {t('general.continue')}
            </Button>
          </div>
        </Container>
        <BottomSpacer />
      </div>
    );
  }
}

const ZOOMING_CONTROLS_Y = 95;
const ZOOMING_CONTROLS_X = 55;
const styles = theme => ({
  suggestionsContainer: { width: '100%', backgroundColor: 'white' },
  suggestionsTypography: { fontSize: 14 },
  inputContainer: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    width: '60%',
    zIndex: 1
  },
  mapContainer: {
    margin: '0px auto 35px auto'
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
  myLocationContainer: {
    position: 'absolute',
    zIndex: 1,
    bottom: ZOOMING_CONTROLS_Y + theme.spacing(2) + 50,
    right: ZOOMING_CONTROLS_X
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

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Location))
);
