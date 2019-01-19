import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

class PrioritiesAchievementsForm extends Component {
  closeModal() {
    this.props.closeModal()
  }

  render() {
    return (
      <div>
        <Form
          onSubmit={(values, form) => {
            // we want to update Family Data
            console.log(values)
            // this.props.addSurveyDataWhole(
            //   this.props.draftId,
            //   'family_data',
            //   familyLocationInfo
            // )
            this.closeModal() // bound to parent
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
              <Field name="reason">
                {({ input, meta }) => (
                  <div className="form-group">
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder="Reason"
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="action">
                {({ input, meta }) => (
                  <div className="form-group">
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder="action"
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="estimatedDate">
                {({ input, meta }) => (
                  <div className="form-group">
                    <input
                      type="number"
                      {...input}
                      className="form-control"
                      placeholder="Months"
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
                  onClick={() => this.closeModal()} // bound to parent
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
)(PrioritiesAchievementsForm)
