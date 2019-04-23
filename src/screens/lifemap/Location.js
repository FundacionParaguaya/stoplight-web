import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
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
import Form from '../../components/Form';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import LocationIcon from '../../assets/location.png';
import MarkerIcon from '../../assets/marker.png';

const params = { v: '3.exp', key: 'AIzaSyAOJGqHfbWY_u7XhRnLi7EbVjdK-osBgAM' };
Geocode.setApiKey(params.key);

export class Location extends Component {
  state = {
    address: '',
    lat: '',
    lng: '',
    moved: false
  };

  handleContinue = () => {
    // validation happens here
    this.props.history.push('/lifemap/economics/0');
  };

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    const { currentDraft } = this.props;
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({ lat: latLng.lat, lng: latLng.lng, address });
        this.props.updateDraft({
          ...currentDraft,
          familyData: {
            ...currentDraft.familyData,
            latitude: latLng.lat,
            longitude: latLng.lng
          }
        });
        Location.getCountryFromLatLng(latLng.lat, latLng.lng).then(c =>
          this.updateDraft('country', c)
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
    const { results } = await Geocode.fromLatLng(lat, lng);
    let country = null;
    if (results && results.length > 0) {
      const r = results.find(result => result.types.includes('country'));
      if (r) {
        country = r.address_components[0].short_name;
      }
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
        latitude: this.state.lat,
        longitude: this.state.lng
      }
    });

    // Using geoloc to find country
    Location.getCountryFromLatLng(lat, lng).then(c =>
      this.updateDraft('country', c)
    );
  };

  onMapCreated = map => {
    this.map = map;
  };

  locateMe = () => {
    const { currentDraft } = this.props;
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude
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
      ).then(c => this.updateDraft('country', c));
    });
  };

  componentDidMount = async () => {
    const { currentDraft } = this.props;
    // get user location happens here

    if (!currentDraft.familyData.latitude) {
      this.locateMe();
    } else {
      this.setState({
        lat: currentDraft.familyData.latitude,
        lng: currentDraft.familyData.longitude
      });
    }
  };

  render() {
    const { t, classes } = this.props;

    return (
      <div>
        <TitleBar title={t('views.location')} />
        <Container>
          {/* Map */}
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading
            }) => (
              <div className={classes.mapContainer}>
                <Gmaps
                  height="560px"
                  lat={this.state.lat}
                  lng={this.state.lng}
                  zoom={12}
                  loadingMessage="Please wait while the map is loading."
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
                        className={classes.input}
                        {...getInputProps({
                          placeholder: 'Search by street or postal code'
                        })}
                      />
                    </Paper>
                    <div style={{ width: '100%', backgroundColor: 'white' }}>
                      {loading && (
                        <List>
                          <ListItem>
                            <ListItemText
                              primary="Loading..."
                              primaryTypographyProps={{
                                style: { fontSize: '14px' }
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
                                      style: { fontSize: '14px' }
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

          <Form
            onSubmit={this.handleContinue}
            submitLabel={t('general.continue')}
          />
        </Container>
        <BottomSpacer />
      </div>
    );
  }
}

const ZOOMING_CONTROLS_Y = 95;
const ZOOMING_CONTROLS_X = 55;
const styles = theme => ({
  inputContainer: {
    position: 'absolute',
    top: theme.spacing.unit * 2,
    left: theme.spacing.unit * 2,
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
    bottom: ZOOMING_CONTROLS_Y + theme.spacing.unit * 2 + 50,
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
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: '14px'
  },
  iconButton: {
    padding: 10
  },
  suggestionsPaper: {
    padding: '2px 4px',
    backgroundColor: 'white'
  }
});

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
});

const mapDispatchToProps = { updateDraft };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Location))
);
