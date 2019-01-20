import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadSurveys, submitDraft } from '../../redux/actions'
import BeginLifemap from './Components/BeginLifeMap'
import FamilyParticipant from './Components/FamilyData/FamilyParticipant'
import FamilyMembers from './Components/FamilyData/FamilyMembers'
import FamilyGender from './Components/FamilyData/FamilyGender'
import FamilyBirthDate from './Components/FamilyData/FamilyBirthDate'
import FamilyMap from './Components/FamilyData/FamilyMap'
import FinalScreen from './Components/FinalScreen'
import IndicatorList from './Components/PrioritiesAchievements/IndicatorList'
import SocioEconomic from './Components/SocioEconomic/'
import StopLight from './Components/StopLight'
import TermsPrivacy from './Components/TermsPrivacy'

// TODO: place survey taker name + draftid in redux
// TODO: moving back one parent step will place you on the first step of the parent

class Lifemap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      draftId: null,
      surveyTakerName: '',
      memberCount: 0
    }
  }
  componentDidMount() {
    this.loadData()
  }

  setMemberCount = num => {
    this.setState({ memberCount: num })
  }

  setDraftId = id => {
    this.setState({ draftId: id })
  }

  loadData = () => {
    this.props.loadSurveys()
  }

  submitDraft = () => {
    let draft = this.props.drafts.filter(
      draft => (draft.draftId === this.state.draftId)
    )[0]
    console.log(draft)
    const res = this.props.submitDraft(draft)
    console.log(res)
  }

  nextStep = () => {
    const { step } = this.state
    this.setState({ step: step + 1 })
  }

  previousStep = () => {
    const { step } = this.state
    this.setState({ step: step - 1 })
  }

  jumpStep = additionalSteps => {
    const { step } = this.state
    console.log(step + additionalSteps)
    this.setState({ step: step + additionalSteps })
  }

  setName = name => {
    this.setState({ surveyTakerName: name })
  }

  render() {
    let survey
    if (this.props.surveys) {
      survey = this.props.surveys.filter(
        survey => survey.id === this.props.location.state.surveyId
      )[0]
    }
    let component = null
    switch (this.state.step) {
      case 1:
        component = survey && (
          <TermsPrivacy
            parentNextStep={this.nextStep}
            prarentPreviousStep={this.previousStep}
            data={survey}
          />
        )
        break
      case 2:
        // create draft at this point
        // draft should remain in state and is filled with answers from each component
        // might want to createa  function that creates the drafts
        // might want to create a handler for submissions of each step, to add to draft state.
        component = survey && (
          <FamilyParticipant
            nextStep={this.nextStep}
            parentPreviousStep={this.previousStep}
            data={survey.surveyConfig}
            surveyId={this.props.location.state.surveyId}
            setName={this.setName}
            setDraftId={this.setDraftId}
          />
        )
        break
      case 3:
        component = (
          <FamilyMembers
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={survey.surveyConfig}
            previousStep={this.previousStep}
            surveyTakerName={this.state.surveyTakerName}
            jumpStep={this.jumpStep}
            setMemberCount={this.setMemberCount}
          />
        )
        break
      case 4:
        component = (
          <FamilyGender
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={survey.surveyConfig}
            previousStep={this.previousStep}
            memberCount={this.state.memberCount}
          />
        )
        break
      case 5:
        component = (
          <FamilyBirthDate
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={survey.surveyConfig}
            previousStep={this.previousStep}
            memberCount={this.state.memberCount}
          />
        )
        break
      case 6:
        component = (
          <FamilyMap
            nextStep={this.nextStep}
            draftId={this.state.draftId}
            data={survey.surveyConfig}
            previousStep={this.previousStep}
          />
        )
        break
      case 7:
        component = survey && (
          <SocioEconomic
            parentNextStep={this.nextStep}
            draftId={this.state.draftId}
            parentPreviousStep={this.previousStep}
            data={survey.surveyEconomicQuestions}
          />
        )
        break
      case 8:
        component = (
          <BeginLifemap
            nextStep={this.nextStep}
            parentPreviousStep={this.previousStep}
            data={survey.surveyStoplightQuestions.length}
          />
        )
        break
      case 9:
        component = survey && (
          <StopLight
            draftId={this.state.draftId}
            data={survey.surveyStoplightQuestions}
            nextStep={this.nextStep}
            parentPreviousStep={this.previousStep}
          />
        )
        break
      case 10:
        component = survey && (
          <IndicatorList
            draftId={this.state.draftId}
            data={survey.surveyStoplightQuestions}
            nextStep={this.nextStep}
            parentPreviousStep={this.previousStep}
            minimumPriorities={survey.minimumPriorities}
          />
        )
        break
      case 11:
      this.submitDraft()
      component = survey && (
        <FinalScreen
          draftId={this.state.draftId}
          data={survey.surveyStoplightQuestions}
          nextStep={this.nextStep}
          parentPreviousStep={this.previousStep}
        />
      )
      break
      // Create a submit handler to send redux store of graph as graphql mutation once Prorities & Achievements is submitted
      default:
        component = <div>NOTHING TO SEE HERE</div>
    }
    return <div style={{ marginTop: 50 }}>{component}</div>
  }
}

const mapStateToProps = state => ({
  state: state,
  surveys: state.surveys,
  drafts: state.drafts
})
const mapDispatchToProps = {
  loadSurveys,
  submitDraft
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lifemap)
