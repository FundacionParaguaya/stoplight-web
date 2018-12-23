import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadSurveys } from '../../redux/actions'
import FamilyParticipant from './Components/FamilyData/FamilyParticipant'
import FamilyMembers from './Components/FamilyData/FamilyMembers'
import SocioEconomic from './Components/SocioEconomic/'
import BeginLifemap from './Components/BeginLifeMap'
import StopLight from './Components/StopLight'
import TermsPrivacy from './Components/TermsPrivacy'

class Lifemap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1
    }
  }
  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    this.props.loadSurveys()
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
    console.log(this.props.surveys)
    let data = this.props.surveys.filter(
      survey => survey.id === this.props.location.state.surveyId
    )
    let component = null
    switch (this.state.step) {
      case 1:
        component = data[0] && (
          <TermsPrivacy
            parentNextStep={this.nextStep}
            prarentPreviousStep={this.previousStep}
            data={data[0]}
          />
        )
        break
      case 2:
        component = data[0] && (
          <FamilyParticipant
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={data[0].surveyConfig}
          />
        )
        break
      case 3:
        component = (
          <FamilyMembers
            nextStep={this.nextStep}
            previousStep={this.previousStep}
          />
        )
        break
      case 4:
        component = data[0] && (
          <SocioEconomic
            parentNextStep={this.nextStep}
            parentPreviousStep={this.previousStep}
            data={data[0].surveyEconomicQuestions}
          />
        )
        break
      case 5:
        component = (
          <BeginLifemap
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={data[0].surveyStoplightQuestions.length}
          />
        )
        break
      case 6:
        component = data && (
          <StopLight
            previousStep={this.previousStep}
            data={data[0].surveyStoplightQuestions}
          />
        )
        break
      default:
        component = <div>NOTHING TO SEE HERE</div>
    }
    return <div style={{ marginTop: 50 }}>{component}</div>
  }
}

const mapStateToProps = state => ({
  state: state,
  surveys: state.surveys
})
const mapDispatchToProps = {
  loadSurveys
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lifemap)
