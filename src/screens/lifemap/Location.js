import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'
import { Gmaps, Marker } from 'react-gmaps'

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete'
import { isAbsolute } from 'path'
const params = { v: '3.exp', key: 'AIzaSyAOJGqHfbWY_u7XhRnLi7EbVjdK-osBgAM' }
export class Location extends Component {
  state = {
    address: '',
    lat: '',
    lng: '',
    accuracy: 0,
    moved: false
  }
  handleContinue = () => {
    console.log(this.props.currentSurvey)
    // validation happens here
    this.props.history.push('/lifemap/economics/0')
  }

  componentDidMount() {
    // get user location happens here
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
    })
  }

  handleChange = address => {
    this.setState({ address })
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ lat: latLng.lat, lng: latLng.lng }))
      .catch(error => console.error('Error', error))
  }
  onDragEnd(e) {
    //update the state
    this.setState({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      accuracy: 0,
      moved: true
    })
  }
  render() {
    const { t, classes } = this.props
    console.log(this.props)
    console.log(this.state)
    return (
      <div>
        <TitleBar title={t('views.location')} />
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
                      : { backgroundColor: '#ffffff', cursor: 'pointer' }
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
                    )
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
          >
            <Marker
              lat={this.state.lat}
              lng={this.state.lng}
              draggable={true}
              onDragEnd={e => this.onDragEnd(e)}
            />
          </Gmaps>
        </div>
        <Button variant="contained" fullWidth onClick={this.handleContinue}>
          {t('general.continue')}
        </Button>
      </div>
    )
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
})

const mapDispatchToProps = { updateDraft }
const styles = {
  // locationSuggestionsContainer: {
  //   borderRadius: 18
  // },
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
    margin: '0px auto 40px auto'
  }
}
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Location))
)
