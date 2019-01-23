import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'
import {
  createDraft,
  addSurveyData,
  addSurveyDataWhole
} from '../../../../redux/actions'
import DatePicker from '../../../../components/DatePicker'
import uuid from 'uuid/v1'
import countries from 'localized-countries'
import { validate } from './helpers/validationParticipant'
import Error from '../../ErrorComponent'
import moment from 'moment'
// put this to its own component
const countryList = countries(require('localized-countries/data/en')).array()

class FamilyParticipant extends Component {
  constructor() {
    super()
    this.state = {
      date: null,
      dateError: 0,
      submitted: false
    }
  }

  componentDidMount() {}
  dateChange(date) {
    this.setState({
      date: date,
      dateError: 1
    })
  }

  async createDraft(values) {
    let surveyId = this.props.surveyId
    let draftId = uuid()
    await this.props.createDraft({
      survey_id: surveyId,
      survey_version_id: this.props.surveys[surveyId]['survey_version_id'] || 1,
      created: Date.now(),
      draftId: draftId,
      familyData: {},
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      priorities: {},
      achievements: {}
    })
    values.firstParticipant = true
    values.birthDate = moment(this.state.date).format('X')
    this.props.setDraftId(draftId)
    this.props.addSurveyDataWhole(draftId, 'familyData', {
      familyMembersList: [values]
    })
    this.props.setName(values['firstName'])
    this.props.draftIsOngoing()
    this.props.nextStep()
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

  updateDraftParticipant(values) {
    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]
    values.firstParticipant = true
    let familyMembersListNew = draft.familyData.familyMembersList
    familyMembersListNew[0] = values
    this.props.addSurveyDataWhole(this.props.draftId, 'familyData', {
      familyMembersList: familyMembersListNew
    })
    this.props.setName(values['firstName'])
    this.props.nextStep()
  }

  initData(user) {
    let res = {}
    res.firstName = user.firstName
    res.lastName = user.lastName
    res.documentNumber = user.documentNumber
    res.gender = user.gender || ''
    res.documentType = user.documentType || ''
    res.birthCountry = user.birthCountry || ''
    res.email = user.email || null
    res.phone = user.phone || null
    return res
  }

  render() {
    // set default countryto beginning of list
    const { t } = this.props
    const countriesOptions = this.generateCountriesOptions()
    let draft,
      user = {}
    if (this.props.draftOngoing) {
      draft = this.props.drafts.filter(
        draft => draft.draftId === this.props.draftId
      )[0]
      user = this.initData(draft.familyData.familyMembersList[0])
    }

    return (
      <div style={{ marginTop: 50 }}>
        <h2> {t('views.primaryParticipant')} </h2>
        <hr />
        <Form
          onSubmit={values => {
            if (this.props.draftId) {
              this.updateDraftParticipant(values)
            } else {
              this.createDraft(values)
            }
          }}
          validate={validate}
          initialValues={{
            firstName: user.firstName || 'First Name',
            lastName: user.lastName || 'Last Name',
            documentNumber: user.documentNumber || 'Document Number',
            gender: user.gender || '',
            documentType: user.documentType || '',
            birthCountry: user.birthCountry || '',
            email: user.email || 'Email',
            phone: user.phone || 'Phone'
          }}
          render={({ handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <Field name="firstName">
                  {({ input, meta }) => {
                    return (
                      <div className="form-group">
                        <input
                          type="text"
                          {...input}
                          className="form-control"
                          placeholder="firstName"
                        />
                        <Error name="firstName" />
                      </div>
                    )
                  }}
                </Field>
              </div>
              <div>
                <Field name="lastName">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder="lastName"
                      />
                      <Error name="lastName" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <div className="form-group">
                  <Field
                    name="gender"
                    component="select"
                    className="custom-select"
                  >
                    <option value="" disabled>
                      {t('views.family.selectGender')}
                    </option>
                    {this.props.data.gender.map(gender => (
                      <option
                        value={gender.value}
                        key={gender.text + gender.value}
                      >
                        {gender.text}
                      </option>
                    ))}
                  </Field>
                  <Error name="gender" />
                </div>
              </div>
              <div>
                <label>{t('views.family.dateOfBirth')}</label>
                <DatePicker
                  dateChange={this.dateChange.bind(this)}
                  minYear={1900}
                  maxYear={2019}
                />
              </div>
              {this.state.dateError === -1 && (
                <span className="badge badge-pill badge-danger">Required</span>
              )}
              <div>
                <div className="form-group">
                  <Field
                    name="documentType"
                    component="select"
                    className="custom-select"
                  >
                    <option value="" disabled>
                      {t('views.family.documentType')}
                    </option>
                    {this.props.data.documentType.map(docType => (
                      <option
                        value={docType.value}
                        key={docType.text + docType.value}
                      >
                        {docType.text}
                      </option>
                    ))}
                  </Field>
                  <Error name="documentType" />
                </div>
              </div>
              <div>
                <Field name="documentNumber">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder="documentNumber"
                      />
                      <Error name="documentNumber" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <div className="form-group">
                  <Field
                    name="birthCountry"
                    component="select"
                    className="custom-select"
                  >
                    <option value="" disabled>
                      {t('views.family.countryOfBirth')}
                    </option>
                    {countriesOptions}
                  </Field>
                  <Error name="birthCountry" />
                </div>
              </div>
              <div>
                <Field name="email">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder="email"
                      />
                      <Error name="email" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <Field name="phone">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <input
                        type="text"
                        {...input}
                        className="form-control"
                        placeholder="phone"
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
                  onClick={() => {
                    if (!this.state.date) {
                      this.setState({ dateError: -1 })
                    }
                  }}
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

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyParticipant)
)
