import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import { validate } from './helpers/validation'

class PrioritiesAchievementsForm extends Component {
  closeModal() {
    this.props.closeModal()
  }

  generatePriorityForm() {
    return (
      <Form
        onSubmit={(values, form) => {
          // we want to update Family Data
          console.log(values)
          let priorityObj = values
          priorityObj.indicator = this.props.indicator
          this.props.addSurveyDataWhole(this.props.draftId, 'priorities', {
            priorities: priorityObj
          })
          this.closeModal() // bound to parent
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
            <Field name="reason">
              {({ input, meta }) => (
                <div className="form-group">
                  <label>Why don't you have it?</label>
                  <input
                    type="text"
                    {...input}
                    className="form-control"
                    placeholder="Write your answer here..."
                  />
                  {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <Field name="action">
              {({ input, meta }) => (
                <div className="form-group">
                  <label>What will you do to get it?</label>
                  <input
                    type="text"
                    {...input}
                    className="form-control"
                    placeholder="Write your answer here..."
                  />
                  {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <Field name="estimatedDate">
              {({ input, meta }) => (
                <div className="form-group">
                  <label> How many months will it take? </label>
                  <input
                    type="number"
                    {...input}
                    className="form-control"
                    placeholder="0"
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
                Save
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
    )
  }

  generateAchievementForm() {
    return (
      <Form
        onSubmit={(values, form) => {
          // we want to update Family Data
          let achievementObj = values
          achievementObj.indicator = this.props.indicator
          this.props.addSurveyDataWhole(this.props.draftId, 'achievements', {
            achievements: achievementObj
          })
          this.closeModal() // bound to parent
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
            <Field name="action">
              {({ input, meta }) => (
                <div className="form-group">
                  <label>How did you get it?</label>
                  <input
                    type="text"
                    {...input}
                    className="form-control"
                    placeholder="Write your answer here..."
                  />
                  {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <Field name="roadmap">
              {({ input, meta }) => (
                <div className="form-group">
                  <label>What did it take to achieve this?</label>
                  <input
                    type="text"
                    {...input}
                    className="form-control"
                    placeholder="Write your answer here..."
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
                Save
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
    )
  }

  renderForm() {
    if (this.props.formType === 'priority') {
      return this.generatePriorityForm()
    } else {
      return this.generateAchievementForm()
    }
  }

  render() {
    console.log(this.props.indicator)
    return (
      <div>
        <h2>{this.props.formType}</h2>
        <hr />
        <h3>{this.props.indicator}</h3>
        {this.renderForm()}
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
