import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import {
  createDraft,
  addSurveyData,
  addSurveyDataWhole
} from '../../../../redux/actions'
import DatePicker from '../../../../components/DatePicker'

import countries from 'localized-countries'

// put this to its own component
const countryList = countries(require('localized-countries/data/en')).array()

console.log(countries)

class FamilyParticipant extends Component {
  constructor() {
    super()
    this.state = {
      date: null
    }
  }

  componentDidMount() {
    let surveyId = this.props.surveyId
    this.props.createDraft({
      survey_id: surveyId,
      survey_version_id: this.props.surveys[surveyId]['survey_version_id'] || 1,
      created: Date.now(),
      draft_id: this.props.draftId,
      familyData: {},
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      priorities: {},
      achievements: {}
    })
  }
  dateChange(date) {
    this.setState({
      date: date
    })
  }

  generateCountriesOptions (){
    const defaultCountry = this.props.data.surveyLocation.country
      ? countryList.filter(item => item.code === this.props.data.surveyLocation.country)[0]
      : ''

    let countries = countryList.filter(
      country => country.code !== defaultCountry.code
    )
    // Add default country to the beginning of the list
    countries.unshift(defaultCountry)
    // Add prefer not to say answer at the end of the list
    countries.push({ code: 'NONE', label: 'I prefer not to say' })
    return countries.map(country => {
      return (<option key={country.code} value={country.code}>{country.label} </option>)
    })

  }
  render() {
    // set default countryto beginning of list
    console.log(this.props.data)
    console.log(countryList)

    let countriesOptions = this.generateCountriesOptions()

    return (
      <div style={{ marginTop: 50 }}>
      <h2> Primary Participant </h2>
      <hr />
        <Form
          onSubmit={(values, form) => {
            values.firstParticipant = true
            values.birthDate = this.state.date
            this.props.addSurveyDataWhole(this.props.draftId, 'family_data', {
              familyMembersList: [values]
            })
            this.props.setName(values['firstName'])
            this.props.nextStep()
          }}
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
              <div>
                <Field name="firstName">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>First name: </label>
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder=""
                      />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <Field name="lastName">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>Last name: </label>
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder=""
                      />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <label>Gender: </label>
                <div className="form-group">
                  <Field
                    name="gender"
                    component="select"
                    className="custom-select"
                  >
                    <option value="">Select gender</option>
                    {this.props.data.gender.map(gender => (
                      <option
                        value={gender.value}
                        key={gender.text + gender.value}
                      >
                        {gender.text}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div>
                <label>Birthdate: </label>
                <DatePicker
                  dateChange={this.dateChange.bind(this)}
                  minYear={1900}
                  maxYear={2019}
                />
              </div>
              <div>
                <label>Document type: </label>
                <div className="form-group">
                  <Field
                    name="documentType"
                    component="select"
                    className="custom-select"
                  >
                    <option value="">Select type</option>
                    {this.props.data.documentType.map(docType => (
                      <option
                        value={docType.value}
                        key={docType.text + docType.value}
                      >
                        {docType.text}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <div>
                <Field name="documentNumber">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>Document: </label>
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder=""
                      />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <label>Country: </label>
                <div className="form-group">
                  <Field
                    name="birthCountry"
                    component="select"
                    className="custom-select"
                  >
                    <option value="">Select country</option>
                    {countriesOptions}
                  </Field>
                </div>
              </div>
              <div>
                <Field name="email">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>Email: </label>
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder=""
                      />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <Field name="phone">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>Phone: </label>
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder=""
                      />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>
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
                  onClick={() => this.props.parentPreviousStep()}
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
  createDraft,
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
)(FamilyParticipant)
