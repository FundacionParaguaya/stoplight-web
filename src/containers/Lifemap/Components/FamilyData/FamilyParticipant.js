import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormSpy, Form, Field } from 'react-final-form'
import {
  createDraft,
  addSurveyData,
  addSurveyDataWhole
} from '../../../../redux/actions'
import uuid from 'uuid/v1'

class FamilyParticipant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      draftId: uuid()
    }
  }

  componentDidMount() {
    let surveyId = this.props.surveyId
    this.props.createDraft({
      survey_id: surveyId,
      survey_version_id: this.props.surveys[surveyId]['survey_version_id'] || 1,
      created: Date.now(),
      draft_id: this.state.draftId,
      personal_survey_data: {},
      economic_survey_data: {},
      indicator_survey_data: {},
      family_data: { familyMembersList: [] }
    })
  }

  render() {
    console.log('draft', this.props.drafts)
    return (
      <div style={{ marginTop: 50 }}>
        <Form
          onSubmit={(values, form) => {
            this.props.addSurveyDataWhole(
              this.state.draftId,
              'personal_survey_data',
              values
            )
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
              <FormSpy
                subscription={{ values: true }}
                component={({ values }) => {
                  if (values) {
                    console.log(values)
                  }
                  return ''
                }}
              />
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
                    name="country"
                    component="select"
                    className="custom-select"
                  >
                    <option value="">Select country</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
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
                  className="btn btn-primary btn-sm btn-block"
                  disabled={pristine || invalid}
                >
                  Submit
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
