import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Gmaps, Marker } from 'react-gmaps'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'
import countries from 'localized-countries'

import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import Error from '../../ErrorComponent'
import { validate } from './helpers/validationMap'
import AppNavbar from '../../../../components/AppNavbar'

const params = { v: '3.exp', key: 'AIzaSyAOJGqHfbWY_u7XhRnLi7EbVjdK-osBgAM' }
const countryList = countries(require('localized-countries/data/en')).array()

class FamilyMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // set Hub HQ as default
      lat: this.props.data.surveyLocation.latitude || 0,
      lng: this.props.data.surveyLocation.longitude || 0,
      accuracy: 0
    }
    this.getLocation()
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  async getLocation() {
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
      accuracy: 0
    })
  }

  generateCountriesOptions() {
    const defaultCountry = this.props.data.surveyLocation.country
      ? countryList.filter(
          item => item.code === this.props.data.surveyLocation.country
        )[0]
      : ''

    let countries = countryList.filter(
      country => country.code !== defaultCountry.code
    )
    // Add default country to the beginning of the list
    countries.unshift(defaultCountry)
    // Add prefer not to say answer at the end of the list
    countries.push({ code: 'NONE', label: 'I prefer not to say' })
    return countries.map(country => {
      return (
        <option key={country.code} value={country.code}>
          {country.label}{' '}
        </option>
      )
    })
  }

  render() {
    const { t } = this.props
    let countriesOptions = this.generateCountriesOptions()
    let defaultCountry = countriesOptions.shift()

    return (
      <div>
        <AppNavbar
          text={t('views.location')}
          showBack={true}
          backHandler={this.props.previousStep}
        />

        <Gmaps
          height={'560px'}
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={12}
          loadingMessage={'Please wait while the map is loading.'}
          params={params}
          onMapCreated={this.onMapCreated}
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
            let familyLocationInfo = {
              latitude: this.state.lat,
              longitude: this.state.lng,
              accuracy: this.state.accuracy,
              country: values.country,
              postCode: values.postCode,
              address: values.address
            }

            this.props.addSurveyDataWhole(
              this.props.draftId,
              'familyData',
              familyLocationInfo
            )
            this.props.nextStep()
          }}
          validate={validate}
          initialValues={{}}
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
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder={t('views.family.postcode')}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="address">
                {({ input, meta }) => (
                  <div className="form-group">
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder={t('views.family.streetOrHouseDescription')}
                    />
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
                  {t('general.continue')}
                </button>
              </div>
            </form>
          )}
        />
      </div>
    )
  }
}

const mapDispatchToProps = {
  addSurveyData,
  addSurveyDataWhole
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyMap)
)
