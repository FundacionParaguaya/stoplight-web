import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withI18n } from 'react-i18next'
import { addSurveyData } from '../../../../redux/actions'
import StopLightPresentational from './StopLightPresentational'
import SkippedQuestions from './SkippedQuestions'

class StopLight extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      renderSkippedQuestionsScreen: false,
      skippedQuestionsList: []
    }
  }

  nextStep = (value, codeName) => {
    const { step } = this.state
    let answer = {}
    answer[codeName] = value.value || 0
    if (answer[codeName] === 0) {
      this.setState(prevState => ({
        skippedQuestionsList: [
          ...prevState.skippedQuestionsList,
          this.props.data[this.state.step]
        ]
      }))
    }
    this.props.addSurveyData(
      this.props.draftId,
      'indicatorSurveyDataList',
      answer
    )
    console.log(this.props.drafts)
    if (this.state.step === this.props.data.length - 1) {
      // render Skipped Questions
      if (this.state.skippedAQuestion) {
        this.setState({ renderSkippedQuestionsScreen: true })
      } else {
        this.props.nextStep()
      }
    } else if (this.state.step > this.props.data.length - 1) {
      this.props.nextStep()
    } else {
      this.setState({ step: step + 1 })
    }
  }

  previousStep = () => {
    const { step } = this.state
    this.setState({ step: step - 1 })
  }

  render() {
    const { t } = this.props
    let stopLightQuestions = this.props.data
    return (
      <div style={{ marginTop: 50 }}>
        <h2>{t('views.yourLifeMap')}</h2>
        <hr />
        {!this.state.renderSkippedQuestionsScreen ? (
          <StopLightPresentational
            data={stopLightQuestions[this.state.step]}
            index={this.state.step}
            total={stopLightQuestions.length - 1}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            parentPreviousStep={this.props.parentPreviousStep}
          />
        ) : (
          <SkippedQuestions questions={this.state.skippedQuestionsList} />
        )}
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

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StopLight)
)
