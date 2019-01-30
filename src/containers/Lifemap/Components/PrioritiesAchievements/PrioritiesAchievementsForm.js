import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'
import { addSurveyPriorityAchievementData } from '../../../../redux/actions'
import { validate } from './helpers/validation'

class PrioritiesAchievementsForm extends Component {
  closeModal() {
    this.props.closeModal()
  }

  generatePriorityForm() {
    const { t } = this.props

    return (
      <Form
        onSubmit={(values, form) => {
          // we want to update Family Data
          let priorityObj = values
          priorityObj.indicator = this.props.indicator
          this.props.addSurveyPriorityAchievementData(
            this.props.draftId,
            'priorities',
            priorityObj
          )
          this.props.addPriority()
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
                className="btn btn-lg"
                onClick={() => this.closeModal()} // bound to parent
              >
                Go Back
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={pristine || invalid}
              >
                {t('general.close')}
              </button>
            </div>
          </form>
        )}
      />
    )
  }

  generateAchievementForm() {
    const { t } = this.props
    return (
      <Form
        onSubmit={(values, form) => {
          // we want to update Family Data
          let achievementObj = values
          achievementObj.indicator = this.props.indicator
          this.props.addSurveyPriorityAchievementData(
            this.props.draftId,
            'achievements',
            achievementObj
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
            <div style={{ paddingTop: 20 }} className="text-center">
              <button
                className="btn btn-lg col-4"
                onClick={() => this.closeModal()} // bound to parent
              >
                Go Back
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg col-4"
                disabled={pristine || invalid}
              >
                {t('general.close')}
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
        <h3>{this.props.questionText}</h3>
        <hr />
        <h2>{this.props.modalTitle}</h2>
        {this.renderForm()}
      </div>
    )
  }
}

const mapDispatchToProps = {
  addSurveyPriorityAchievementData
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PrioritiesAchievementsForm)
)
