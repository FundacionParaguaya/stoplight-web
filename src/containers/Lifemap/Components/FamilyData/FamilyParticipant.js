import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'
import moment from 'moment'

import {
  createDraft,
  addSurveyData,
  addSurveyDataWhole,
  addSurveyFamilyMemberData
} from '../../../../redux/actions'
import DatePicker from '../../../../components/DatePicker'
import uuid from 'uuid/v1'
import countries from 'localized-countries'
import { validate } from './helpers/validationParticipant'
import Error from '../../ErrorComponent'
import family_face_large from '../../../../assets/family_face_large.png'

import AppNavbar from '../../../../components/AppNavbar'

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

  dateChange(date) {
    this.setState({
      date: date,
      dateError: moment(this.state.date).format('X') === 'Invalid date' ? -1 : 1
    })
  }

  addSurveyData = (text, field) => {
    this.props.addSurveyFamilyMemberData({
      id: this.draftId,
      index: 0,
      payload: {
        [field]: text
      }
    })
  }

  getDraft() {
    if (!this.props.draftId) {
      let surveyId = this.props.surveyId
      let draftId = uuid()
      this.props.createDraft({
        surveyId: surveyId,
        created: Date.now(),
        draftId: draftId,
        economicSurveyDataList: [],
        indicatorSurveyDataList: [],
        priorities: [],
        achievements: [],
        familyData: {
          familyMembersList: [
            {
              firstParticipant: true,
              socioEconomicAnswers: []
            }
          ]
        }
      })
      this.props.setDraftId(draftId)
      this.props.draftIsOngoing()
    }
    return this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]
  }

  addSurveyData = (text, field) => {
    this.props.addSurveyFamilyMemberData({
      id: this.props.draftId,
      index: 0,
      payload: {
        [field]: text
      }
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

  initData(user) {
    let res = {}
    res.firstName = user.firstName
    res.lastName = user.lastName
    res.documentNumber = user.documentNumber
    res.gender = user.gender || ''
    res.documentType = user.documentType || ''
    res.birthDate = user.birthDate || null
    res.birthCountry = user.birthCountry || ''
    res.email = user.email || null
    res.phoneNumber = user.phoneNumber || null
    return res
  }

  render() {
    // set default country to beginning of list
    const { t } = this.props
    const countriesOptions = this.generateCountriesOptions()
    let draft,
      user = {}
    if (this.props.draftOngoing) {
      draft = this.getDraft()
      user = this.initData(draft.familyData.familyMembersList[0])
      if (this.state.date === null && user.birthDate !== null) {
        this.setState({
          date: new Date(parseInt(user.birthDate * 1000)),
          dateError: 1
        })
      }
    }

    return (
      <div>
        <AppNavbar
          text={t('views.primaryParticipant')}
          showBack={true}
          backHandler={this.props.parentPreviousStep}
          draftOngoing={this.props.draftId ? true : false}
        />
        <div className="text-center">
          <img src={family_face_large} alt="family_face_large" />
        </div>
        <Form
          onSubmit={values => {
            if (moment(this.state.date).format('X') === 'Invalid date') {
              this.setState({ dateError: -1 })
            } else {
              draft = this.getDraft()
              values.birthDate = moment(this.state.date).format('X')
              Object.keys(values).forEach(key => {
                this.addSurveyData(values[key], key)
              })
              this.props.nextStep()
            }
          }}
          validate={validate}
          initialValues={{
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            documentNumber: user.documentNumber || '',
            gender: user.gender || '',
            documentType: user.documentType || '',
            birthCountry: user.birthCountry || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || ''
          }}
          render={({ handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <Field name="firstName">
                  {({ input, meta }) => {
                    return (
                      <div className="form-group">
                        <label> {t('views.family.firstName')} </label>
                        <input
                          type="text"
                          {...input}
                          className="form-control"
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
                      <label> {t('views.family.lastName')} </label>
                      <input type="text" {...input} className="form-control" />
                      <Error name="lastName" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <div className="form-group">
                  <label> {t('views.family.selectGender')} </label>
                  <Field
                    name="gender"
                    component="select"
                    className="form-control custom-select"
                  >
                    <option value="" disabled />
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
              <div className="date-div">
                <label className="form-label date-label m0">
                  {t('views.family.dateOfBirth')}
                </label>
                <DatePicker
                  dateChange={this.dateChange.bind(this)}
                  minYear={1900}
                  maxYear={2019}
                  defaultDate={user.birthDate}
                />
                {this.state.dateError === -1 && (
                  <span className="badge badge-pill badge-danger">
                    Required
                  </span>
                )}
              </div>
              <div>
                <div className="form-group">
                  <label> {t('views.family.documentType')} </label>
                  <Field
                    name="documentType"
                    component="select"
                    className="form-control"
                  >
                    <option value="" disabled />
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
                      <label>{t('views.family.documentNumber')}</label>
                      <input type="text" {...input} className="form-control" />
                      <Error name="documentNumber" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <div className="form-group">
                  <label>{t('views.family.countryOfBirth')}</label>
                  <Field
                    name="birthCountry"
                    component="select"
                    className="form-control"
                  >
                    <option value="" disabled />
                    {countriesOptions}
                  </Field>
                  <Error name="birthCountry" />
                </div>
              </div>
              <div>
                <Field name="email">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>{t('views.family.email')}</label>
                      <input type="text" {...input} className="form-control" />
                      <Error name="email" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <Field name="phoneNumber">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>{t('views.family.phone')}</label>
                      <input type="text" {...input} className="form-control" />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => {
                    if (!this.state.date) {
                      this.setState({ dateError: -1 })
                    }
                  }}
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
  createDraft,
  addSurveyData,
  addSurveyDataWhole,
  addSurveyFamilyMemberData
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
