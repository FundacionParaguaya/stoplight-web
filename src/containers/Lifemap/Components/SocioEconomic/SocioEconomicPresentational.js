import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form } from 'react-final-form'
import { addSurveyData } from '../../../../redux/actions'
import { withI18n } from 'react-i18next'
import SocioEconomicQuestion from './SocioEconomicQuestion'

class SocioEconomicPresentational extends Component {
  goBack() {
    if (this.props.index === 0) {
      this.props.parentPreviousStep()
    } else {
      this.props.previousStep()
    }
  }

  render() {
    const { t } = this.props
    const questions = this.props.data.sortedQuestions
    const category = this.props.data.category
    return (
      <div style={{ marginTop: 50 }}>
        <h2>{category}</h2>
        <hr />
        <Form
          onSubmit={(values, form) => {
            Object.keys(values).forEach(key => {
              this.props.addSurveyData(
                this.props.draftId,
                'economicSurveyDataList',
                {[key]: values[key]}
              )
            })

            if (this.props.index === this.props.total - 1) {
              this.props.parentStep()
            } else {
              this.props.nextStep()
            }
          }}
          validate={this.props.validate}
          initialValues={{}}
          render={({ handleSubmit, pristine, invalid }) => (
            <form onSubmit={handleSubmit}>
              {questions
                .filter(question => question.forFamilyMember === false)
                .map(question => (
                  <SocioEconomicQuestion key={question.codeName} question={question} />
                ))}
              <div style={{ paddingTop: 20 }}>
                <button type="submit" className="btn btn-primary btn-lg btn-block">
                  {t('general.continue')}
                </button>
              </div>
            </form>
          )}
        />
        <button
          className="btn btn-lg"
          onClick={() => this.goBack()}
        >
          Go Back
        </button>
      </div>
    )
  }
}

const mapDispatchToProps = {
  addSurveyData
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default withI18n()(connect(
  mapStateToProps,
  mapDispatchToProps
)(SocioEconomicPresentational))
