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
      if (question.required === true) {
        question.questionText += ' *'
      }
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

  nextStep = () => {
    const { step } = this.state
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

    const requiredQuestions = splicedSurveyQuestions.map(data =>
      data.sortedQuestions.filter(question => question.required)
    )

    let requiredCodeNames = requiredQuestions[0].map(
      question => question.codeName
    )

    const validate = values => {
      const errors = {}
      requiredCodeNames.forEach(codeName => {
        if (!values[codeName]) {
          errors[codeName] = 'Required'
        }
      })
      return errors
    }

    return (
      <div style={{ marginTop: 50 }}>
        {
          <SocioEconomicPresentational
            draftId={this.props.draftId}
            data={splicedSurveyQuestions[0]}
            index={this.state.step}
            total={this.state.surveyEconomicQuestions.length}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            parentPreviousStep={this.props.parentPreviousStep}
            parentStep={this.props.parentNextStep}
            requiredQuestions={requiredQuestions}
            validate={validate}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocioEconomic)
