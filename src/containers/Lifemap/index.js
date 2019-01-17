import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadSurveys } from '../../redux/actions'
import FamilyParticipant from './Components/FamilyData/FamilyParticipant'
import FamilyMembers from './Components/FamilyData/FamilyMembers'
import FamilyGender from './Components/FamilyData/FamilyGender'
import FamilyBirthDate from './Components/FamilyData/FamilyBirthDate'
import FamilyMap from './Components/FamilyData/FamilyMap'
import SocioEconomic from './Components/SocioEconomic/'
import BeginLifemap from './Components/BeginLifeMap'
import StopLight from './Components/StopLight'
import TermsPrivacy from './Components/TermsPrivacy'
import uuid from 'uuid/v1'

class Lifemap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      draftId: uuid()
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
    let data = []
    if (this.props.surveys) {
      data = this.props.surveys.filter(
        survey => survey.id === this.props.location.state.surveyId
      )
    }
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
        // create draft at this point
        // draft should remain in state and is filled with answers from each component
        // might want to createa  function that creates the drafts
        // might want to create a handler for submissions of each step, to add to draft state.
        component = data[0] && (
          <FamilyParticipant
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            data={data[0].surveyConfig}
            draftId={this.state.draftId}
            surveyId={this.props.location.state.surveyId}
          />
        )
        break
      case 3:
        component = (
          <FamilyMembers
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={data[0].surveyConfig}
            previousStep={this.previousStep}
          />
        )
        break
      case 4:
        component = (
          <FamilyGender
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={data[0].surveyConfig}
            previousStep={this.previousStep}
          />
        )
        break
      case 5:
        component = (
          <FamilyBirthDate
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={data[0].surveyConfig}
            previousStep={this.previousStep}
          />
        )
        break
      case 6:
        component = (
          <FamilyMap
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={data[0].surveyConfig}
            previousStep={this.previousStep}
          />
        )
        break
      case 7:
        component = data[0] && (
          <SocioEconomic
            parentNextStep={this.nextStep}
            draftId={this.state.draftId}
            parentPreviousStep={this.previousStep}
            data={data[0].surveyEconomicQuestions}
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
            draftId={this.state.draftId}
            previousStep={this.previousStep}
            data={data[0].surveyStoplightQuestions}
            nextStep={this.nextStep}
          />
        )
        break
      // Still missing Case 7 for Priorities & Achievements views
      // Create a submit handler to send graphql mutation once Prorities & Achievements is submitted
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
