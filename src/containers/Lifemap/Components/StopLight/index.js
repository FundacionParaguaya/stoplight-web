import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withI18n } from 'react-i18next'
import { addSurveyData } from '../../../../redux/actions'
import StopLightPresentational from './StopLightPresentational'
import AppNavbar from '../../../../components/AppNavbar'

class StopLight extends Component {
  constructor(props) {
    super(props)

    let draft = this.getDraft()
    this.state = {
      step:
        draft.indicatorSurveyDataList.length > 0
          ? draft.indicatorSurveyDataList.length - 1
          : 0,
      renderSkippedQuestionsScreen: false,
      skippedQuestionsList: [],
      imagesLoaded: 0
    }
  }

  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.props.draftId)[0]

  nextStep = (value, codeName) => {
    this.setState({ imagesLoaded: 0 })

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

    if (this.state.step === this.props.data.length - 1) {
      // render Skipped Questions - to be implemented
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
    this.setState({ step: step - 1, imagesLoaded: 0 })
  }

  updateImageStatus = () => {
    this.setState({ imagesLoaded: this.state.imagesLoaded + 1 })
  }

  getCheckedIndicator = () => {
    let draft = this.getDraft()
    let checkedAnswer = draft.indicatorSurveyDataList.filter(
      indicator => indicator.key === this.props.data[this.state.step].codeName
    )[0]
      ? draft.indicatorSurveyDataList.filter(
          indicator =>
            indicator.key === this.props.data[this.state.step].codeName
        )[0].value
      : null
    console.log(checkedAnswer)
    return checkedAnswer || null
  }

  goBack = () => {
    if (this.state.step <= 0) {
      this.props.parentPreviousStep()
    } else {
      this.previousStep()
    }
  }

  render() {
    const { t } = this.props
    this.getCheckedIndicator()
    let stopLightQuestions = this.props.data
    return (
      <div>
        <AppNavbar
          text={t('views.yourLifeMap')}
          showBack={true}
          backHandler={() => this.goBack()}
        />
        <StopLightPresentational
          data={stopLightQuestions[this.state.step]}
          index={this.state.step}
          total={stopLightQuestions.length - 1}
          nextStep={this.nextStep}
          previousStep={this.previousStep}
          parentPreviousStep={this.props.parentPreviousStep}
          imagesLoaded={this.state.imagesLoaded}
          updateImageStatus={this.updateImageStatus}
          checkedAnswer={this.getCheckedIndicator()}
        />
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
