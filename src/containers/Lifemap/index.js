import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadSurveys } from '../../redux/actions'
import Terms from './Components/TermsPrivacy/Terms'
import Privacy from './Components/TermsPrivacy/Privacy'
import FamilyParticipant from './Components/FamilyDetails/FamilyParticipant'
import FamilyMembers from './Components/FamilyDetails/FamilyMembers'
import SocioEconomic from './Components/SocioEconomic'
import BeginLifemap from './Components/BeginLifeMap'
import StopLight from './Components/StopLight'

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
    let surveyData = data[0]
    let component = null
    switch (this.state.step) {
      case 1:
        component = data[0] && (
          <Terms
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={data[0].termsConditions}
          />
        )
        break
      case 2:
        component = data[0] && (
          <Privacy
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={data[0].privacyPolicy}
          />
        )
        break
      case 3:
        component = data[0] && (
          <FamilyParticipant
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={data[0].surveyConfig}
          />
        )
        break
      case 4:
        component = (
          <FamilyMembers
            nextStep={this.nextStep}
            previousStep={this.previousStep}
          />
        )
        break
      case 5:
        component = surveyData && (
          <SocioEconomic
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={surveyData.surveyEconomicQuestions.slice(0, 4)}
          />
        )
        break
      case 6:
        component = (
          <SocioEconomic
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={surveyData.surveyEconomicQuestions.slice(4, 6)}
          />
        )
        break
      case 7:
        component = (
          <SocioEconomic
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={surveyData.surveyEconomicQuestions.slice(6, 11)}
          />
        )
        break
      case 8:
        component = (
          <BeginLifemap
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={data[0].surveyStoplightQuestions.length}
          />
        )
        break
      case 9:
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
