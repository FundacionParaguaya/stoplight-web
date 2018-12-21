import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormSpy, Form, Field } from 'react-final-form'

class SocioEconomic extends Component {
  render() {
    const questions = this.props.data
    return (
      <div style={{ marginTop: 50 }}>
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
                  className="btn btn-primary btn-sm btn-block"
                  disabled={pristine || invalid}
                  onClick={() => this.props.nextStep()}
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

const mapDispatchToProps = {}

export default connect(
  null,
  mapDispatchToProps
)(SocioEconomic)
