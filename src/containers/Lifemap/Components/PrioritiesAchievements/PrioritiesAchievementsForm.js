import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import { validate } from './helpers/validation'

class PrioritiesAchievementsForm extends Component {
  closeModal() {
    this.props.closeModal()
  }

  generatePriorityForm(){
    const { t } = this.props

    return (
        <Form
          onSubmit={(values, form) => {
            // we want to update Family Data
            console.log(values)
            let priorityObj = values
            priorityObj.indicator = this.props.indicator
            this.props.addSurveyDataWhole(
              this.props.draftId,
              'priorities',
              {priorities: priorityObj}
            )
            this.closeModal() // bound to parent
          }}
          validation={validate}
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
                  <label>{t('views.lifemap.whyDontYouHaveIt')}</label>
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder={t('views.lifemap.writeYourAnswerHere')}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="action">
                {({ input, meta }) => (
                  <div className="form-group">
                  <label>{t('views.lifemap.whatWillYouDoToGetIt')}</label>
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder={t('views.lifemap.writeYourAnswerHere')}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="estimatedDate">
                {({ input, meta }) => (
                  <div className="form-group">
                  <label>{t('views.lifemap.howManyMonthsWillItTake')}</label>
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

  generateAchievementForm(){
    const { t } = this.props

    return (
        <Form
          onSubmit={(values, form) => {
            // we want to update Family Data
            let achievementObj = values
            achievementObj.indicator = this.props.indicator
            this.props.addSurveyDataWhole(
              this.props.draftId,
              'achievements',
              {achievements: achievementObj}
            )
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
                  <label>{t('views.lifemap.howDidYouGetIt')}</label>
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder={t('views.lifemap.writeYourAnswerHere')}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="roadmap">
                {({ input, meta }) => (
                  <div className="form-group">
                  <label>{t('views.lifemap.whatDidItTakeToAchieveThis')}</label>
                    <input
                      type="text"
                      {...input}
                      className="form-control"
                      placeholder={t('views.lifemap.writeYourAnswerHere')}
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

export default withI18n()(connect(
  mapStateToProps,
  mapDispatchToProps
)(PrioritiesAchievementsForm))
