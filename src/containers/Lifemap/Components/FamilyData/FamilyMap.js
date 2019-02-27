import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { Gmaps, Marker } from 'react-gmaps'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'
import countries from 'localized-countries'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete'

import { addSurveyData, addSurveyDataWhole } from "../../../../redux/actions";
import Error from "../../ErrorComponent";
import AppNavbar from "../../../../components/AppNavbar";

const params = { v: "3.exp", key: "AIzaSyAOJGqHfbWY_u7XhRnLi7EbVjdK-osBgAM" };
const countryList = countries(require("localized-countries/data/en")).array();

class FamilyMap extends Component {
  constructor(props) {
    super(props)
    let draft = this.getDraft()
    let lat = this.props.data.surveyLocation.latitude || 0
    let lng = this.props.data.surveyLocation.longitude || 0
    // check if latitude has already been set and override it
    if (
      draft.familyData.hasOwnProperty('latitude') &&
      draft.familyData.hasOwnProperty('longitude')
    ) {
      lat = draft.familyData.latitude
      lng = draft.familyData.longitude
    }
    this.state = {
      // set Hub HQ as default
      address:'',
      lat: lat,
      lng: lng,
      accuracy: 0,
      moved: false
    }
    this.getLocation()
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.props.draftId)[0]

  async getLocation() {
    if (!this.state.moved) {
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(position => {
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        })
      } else {
        return
      }
    }
  }

  handleChange = address => {
    this.setState({ address })
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({lat: latLng.lat, lng: latLng.lng}))
      .catch(error => console.error('Error', error))
  }

  onMapCreated(map) {
    // map.setOptions({
    //   disableDefaultUI: true
    // })
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

  generateCountriesOptions() {
    const defaultCountry = this.props.data.surveyLocation.country
      ? countryList.filter(
          item => item.code === this.props.data.surveyLocation.country
        )[0]
      : "";

    let countries = countryList.filter(
      country => country.code !== defaultCountry.code
    );
    // Add default country to the beginning of the list
    countries.unshift(defaultCountry);
    // Add prefer not to say answer at the end of the list
    countries.push({ code: "NONE", label: "I prefer not to say" });
    return countries.map(country => {
      return (
        <option key={country.code} value={country.code}>
          {country.label}{" "}
        </option>
      );
    });
  }

  handleSubmit() {
    this.setState({
      submitted: true
    });
  }

  nextStep = () => {
    const {
      location: {
        state: { surveyId }
      }
    } = this.props;
    return (
      <Redirect
        push
        to={{
          pathname: `/lifemap/${surveyId}/6/0`,
          state: {
            surveyId
          }
        }}
      />
    );
  };

  render() {
    const { t } = this.props;
    let countriesOptions = this.generateCountriesOptions();
    let defaultCountry = countriesOptions.shift();

    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0];
    let familyMemberCount = draft.familyData.countFamilyMembers;
    console.log(familyMemberCount);

    if (this.state.submitted) {
      return this.nextStep();
    }

    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]
    let familyMemberCount = draft.familyData.countFamilyMembers
    console.log(familyMemberCount)
    return (
      <div>
        <AppNavbar
          text={t("views.location")}
          showBack={true}
          backHandler={
            familyMemberCount > 1
              ? this.props.previousStep
              : () => this.props.jumpStep(-3)
          }
        />
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
            <div className="map-input">
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input'

                })}
                className="form-group form-control"
                style={{"marginBottom":"0"}}
              />
              <div className="autocomplete-dropdown-container list-group" >
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active list-group-item'
                    : 'suggestion-item list-group-item'
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' }
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <Gmaps
          height={"560px"}
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={12}
          loadingMessage={"Please wait while the map is loading."}
          params={params}
          onMapCreated={this.onMapCreated}
          scrollwheel={false}
        >
          <Marker
            lat={this.state.lat}
            lng={this.state.lng}
            draggable={true}
            onDragEnd={this.onDragEnd}
          />
        </Gmaps>
        <br />
        <Form
          onSubmit={(values, form) => {
            // we want to update Family Data
            console.log(values);
            let familyLocationInfo = {
              latitude: this.state.lat,
              longitude: this.state.lng,
              accuracy: this.state.accuracy,
              country: values.country,
              postCode: values.postCode,
              address: values.address
            };

            this.props.addSurveyDataWhole(
              this.props.draftId,
              "familyData",
              familyLocationInfo
            );
            this.handleSubmit();
          }}
          initialValues={{ country: this.props.data.surveyLocation.country }}
          render={({
            handleSubmit,
            submitting,
            pristine,
            values,
            form,
            invalid
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('views.family.selectACountry')}</label>
                <Field
                  name="country"
                  component="select"
                  className="custom-select form-control"
                >
                  {defaultCountry}
                  {countriesOptions}
                </Field>
                <Error name="country" />
              </div>
              <Field name="postCode">
                {({ input, meta }) => (
                  <div className="form-group">
                    <label>{t('views.family.postcode')}</label>
                    <input type="text" {...input} className="form-control" />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="address">
                {({ input, meta }) => (
                  <div className="form-group">
                    <label>{t('views.family.streetOrHouseDescription')}</label>
                    <input type="text" {...input} className="form-control" />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={invalid}
                >
                  {t("general.continue")}
                </button>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  addSurveyData,
  addSurveyDataWhole
};

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
});

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyMap)
);
