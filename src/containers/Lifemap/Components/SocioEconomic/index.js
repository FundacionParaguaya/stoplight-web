import React, { Component } from 'react'
import { connect } from 'react-redux'
import SocioEconomicPresentational from './SocioEconomicPresentational'

class SocioEconomic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      surveyEconomicQuestions: this.formatQuestions(this.props.data),
      answers: []
    }
  }

  formatQuestions = questions => {
    let categories = {}
    let res = []
    questions.forEach(question => {
      if (!categories.hasOwnProperty(question.topic)) {
        categories[question.topic] = []
        categories[question.topic].push(question)
      } else {
        categories[question.topic].push(question)
      }
    })
    for (var key in categories) {
      res.push({ category: key, sortedQuestions: categories[key] })
    }
    return res
  }

  nextStep = (index, value) => {
    const { step } = this.state
    let answersCopy = [...this.state.answers]
    answersCopy[index] = value
    this.setState({ answers: answersCopy })
    if (this.state.step === this.state.surveyEconomicQuestions.length) {
      this.props.parentNextStep()
    }
    this.setState({ step: step + 1 })
  }

  previousStep = () => {
    const { step } = this.state
    this.setState({ step: step - 1 })
  }

  render() {
    const splicedSurveyQuestions =
      this.state.surveyEconomicQuestions &&
      this.state.surveyEconomicQuestions.filter(
        (category, index) => index === this.state.step
      )
    // console.log(splicedSurveyQuestions)
    return (
      <div style={{ marginTop: 50 }}>
        {
          <SocioEconomicPresentational
            data={splicedSurveyQuestions[0]}
            index={this.state.step}
            total={this.state.surveyEconomicQuestions.length}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {}

export default connect(
  null,
  mapDispatchToProps
)(SocioEconomic)
