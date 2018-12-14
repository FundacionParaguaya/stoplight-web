import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadSurveys } from '../redux/actions'
import { FormSpy, Form, Field } from 'react-final-form'

class Surveys extends Component {
  render() {
    let data = this.props.surveys
      ? this.props.surveys.surveyEconomicQuestions
      : []
    return (
      <div>
        <Form
          onSubmit={(values, form) => {
            console.log('submitted: ', values)
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
                    console.log('formspy stuff: ', values)
                  }
                  return ''
                }}
              />
              {data &&
                data.map(question => (
                  <div key={question.questionText}>
                    <Field name={question.codeName}>
                      {({ input, meta }) => (
                        <div className="form-group">
                          <label>{question.questionText}</label>
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
                  </div>
                ))}
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

const mapStateToProps = state => ({
  surveys: state.surveys
})

const mapDispatchToProps = {
  loadSurveys
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Surveys)
