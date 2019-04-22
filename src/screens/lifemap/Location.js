import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { Gmaps } from 'react-gmaps';
import { updateDraft } from '../../redux/actions';
import Input from '../../components/Input';
import TitleBar from '../../components/TitleBar';
import Select from '../../components/Select';
import Form from '../../components/Form';
import Container from '../../components/Container';
import BottomSpacer from '../../components/BottomSpacer';
import LocationIcon from '../../assets/location.png';
import MarkerIcon from '../../assets/marker.png';

const params = { v: '3.exp', key: 'AIzaSyAOJGqHfbWY_u7XhRnLi7EbVjdK-osBgAM' };

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

  onDragEnd = e => {
    const { currentDraft } = this.props;
    // Update the state
    this.setState({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
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
  };

  // onMapCenterChanged = () => {
  //   this.setState({
  //     lat: this.map.center.lat(),
  //     lng: this.map.center.lng(),
  //     moved: true
  //   });
  // };

  onMapCreated = map => {
    this.map = map;
  };

  componentDidMount = async () => {
    const { currentDraft } = this.props;
    // get user location happens here

    if (!currentDraft.familyData.latitude) {
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
      });
    } else {
      this.setState({
        lat: currentDraft.familyData.latitude,
        lng: currentDraft.familyData.longitude
      });
    }
  };

  render() {
    const { t, classes } = this.props;
    const { familyData } = this.props.currentDraft;

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
              <div className={classes.inputContainer}>
                <div className={classes.iconContainerLocation}>
                  <i
                    style={{ fontSize: 30, paddingLeft: '14px' }}
                    className="material-icons"
                  >
                    search
                  </i>
                  <input
                    {...getInputProps({
                      placeholder: 'Search Places ...'
                    })}
                    margin="normal"
                    className={classes.inputLocation}
                  />
                </div>
                <div>
                  {loading && <div>Loading...</div>}
                  <div className={classes.locationSuggestionsContainer}>
                    {suggestions.map(suggestion => {
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                      return (
                        <div
                          className={classes.locationSuggestion}
                          {...getSuggestionItemProps(suggestion, {
                            style
                          })}
                        >
                          <span className={classes.spanLocation}>
                            {suggestion.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </PlacesAutocomplete>
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
              disableDefaultUI
              zoomControl
            >
              <div className={classes.markerContainer}>
                <img src={MarkerIcon} className={classes.markerIcon} alt="" />
              </div>
              <div className={classes.myLocationContainer}>
                <img
                  src={LocationIcon}
                  className={classes.myLocationIcon}
                  alt=""
                />
              </div>
            </Gmaps>
          </div>

          {/* Map End */}

          <Form
            onSubmit={this.handleContinue}
            submitLabel={t('general.continue')}
          >
            <Select
              required
              label={t('views.family.selectACountry')}
              value={familyData.country || ''}
              field="country"
              onChange={this.updateDraft}
              country
            />
            <Input
              label={t('views.family.postcode')}
              value={familyData.postCode}
              field="postCode"
              onChange={this.updateDraft}
            />

            <Input
              label={t('views.family.streetOrHouseDescription')}
              value={familyData.streetOrHouseDescription}
              field="streetOrHouseDescription"
              onChange={this.updateDraft}
            />
          </Form>
        </Container>
        <BottomSpacer />
      </div>
    );
  }
}

const ZOOMING_CONTROLS_Y = 95;
const ZOOMING_CONTROLS_X = 55;
const styles = theme => ({
  locationSuggestion: {
    height: 40,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
    borderRight: '1px solid rgba(0, 0, 0, 0.1)'
  },
  inputLocation: {
    height: 51,
    width: 660,
    outline: 'none',
    border: 'none',
    fontSize: 18,
    paddingLeft: 10
  },
  iconContainerLocation: {
    display: 'flex',
    alignItems: 'center'
  },
  inputContainer: {
    position: 'absolute',
    top: '130px',
    left: '50%',
    transform: 'translate(-50%, -0%)',
    zIndex: 1,
    backgroundColor: 'white'
  },
  mapContainer: {
    margin: '0px auto 35px auto'
  },
  markerContainer: {
    position: 'absolute',
    zIndex: 10000000,
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
    zIndex: 10000000,
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
