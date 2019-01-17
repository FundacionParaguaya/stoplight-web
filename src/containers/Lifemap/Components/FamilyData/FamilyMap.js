import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Gmaps, Marker } from 'react-gmaps'
import { Form, Field } from 'react-final-form'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

const params = { v: '3.exp', key: 'AIzaSyAOJGqHfbWY_u7XhRnLi7EbVjdK-osBgAM' }

class FamilyMap extends Component {
  constructor() {
    super()
    this.state = {
      // set paraguay HQ
      lat: -25.3092612,
      lng: -57.5872545,
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
    // call redux action to save location!
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    })
  }

  onDragEnd(e) {
    //update the state
    this.setState({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      accuracy: 0
    })
  }

  onCloseClick() {
    console.log('onCloseClick')
  }

  onClick(e) {
    console.log('onClick', e)
  }

  render() {
    return (
      <div style={{ marginTop: 50 }}>
        <Gmaps
          width={'800px'}
          height={'600px'}
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
              'family_data',
              familyLocationInfo
            )
            this.props.nextStep()
          }}
          initialValues={{}}
          render={({
            handleSubmit,
            submitting,
            pristine,
            values,
            focm,
            invalid
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <Field
                  name="country"
                  component="select"
                  className="custom-select"
                >
                  <option value="">Country</option>
                </Field>
              </div>
              <Field name="postCode">
                {({ input, meta }) => (
                  <div className="form-group">
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder="Post Code"
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
                      placeholder="Address"
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={pristine || invalid}
                >
                  Submit
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => this.props.previousStep()}
                >
                  Go Back
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FamilyMap)
