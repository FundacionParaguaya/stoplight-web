import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormSpy, Form, Field } from 'react-final-form'
import {  addSurveyDataWhole } from '../../../../redux/actions'

class SocioEconomicPresentational extends Component {
  goBack() {
    if (this.props.index === 0) {
      this.props.parentPreviousStep()
    } else {
      this.props.previousStep()
    }
  }
  render() {
    const questions = this.props.data.sortedQuestions
    const category = this.props.data.category
    return (
      <div style={{ marginTop: 50 }}>
        <div>{category}</div>
        <Form
          onSubmit={(values, form) => {
            this.props.addSurveyDataWhole(
              this.props.draftId,
              'economic_survey_data',
              values
            )
            if (this.props.index === this.props.total - 1) {
              this.props.parentStep()
            } else {
              this.props.nextStep()
            }
            console.log(this.props.drafts)
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
                    //      console.log('formspy stuff: ', values)
                  }
                  return ''
                }}
              />
              {questions.map(question => (
                <div key={question.codeName}>
                  <label>{question.questionText} </label>
                  <div className="form-group">
                    {question.answerType !== 'select' ? (
                      <Field name={question.codeName}>
                        {({ input, meta }) => (
                          <div className="form-group">
                            <input
                              type="text"
                              {...input}
                              className="form-control"
                              placeholder=""
                            />
                            {meta.touched && meta.error && (
                              <span>{meta.error}</span>
                            )}
                          </div>
                        )}
                      </Field>
                    ) : (
                      <Field
                        name={question.codeName}
                        component="select"
                        className="custom-select"
                      >
                        <option value="">Select type</option>
                        {question.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.text}
                          </option>
                        ))}
                      </Field>
                    )}
                  </div>
                </div>
              ))}
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={pristine || invalid}
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        />
        <button
          className="btn btn-primary btn-lg"
          onClick={() => this.goBack()}
        >
          Go Back
        </button>
      </div>
    )
  }
}

const mapDispatchToProps = {
  addSurveyDataWhole
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocioEconomicPresentational)
