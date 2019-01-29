import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  loadSurveys,
  submitDraft,
  saveStep,
  saveDraftId,
  saveSurveyId
} from '../../redux/actions'
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
      step: this.props.surveyStatus.step || 1,
      draftId: this.props.surveyStatus.draftId || null,
      surveyTakerName: '',
      memberCount: 0,
      draftOnGoing: this.props.surveyStatus.draftId ? true : false,
      draft: null
    }
  }

  // Setup the `beforeunload` event listener
  setupBeforeUnloadListener = () => {
    window.addEventListener('beforeunload', ev => {
      ev.preventDefault()
      return (ev.returnValue = 'Are you sure you want to close?')
    })
  }

  componentDidMount() {
    this.loadData()
    this.setupBeforeUnloadListener()
  }

  draftIsOngoing = () => {
    this.setState({ draftOnGoing: true })
  }

  setMemberCount = num => {
    this.setState({ memberCount: num })
  }

  setDraftId = id => {
    this.props.saveDraftId(id)
    this.setState({ draftId: id })
  }

  loadData = () => {
    this.props.loadSurveys()
  }

  submitDraft = () => {
    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.state.draftId
    )[0]
    const res = this.props.submitDraft(draft)
    console.log(res)
  }

  nextStep = () => {
    const { step } = this.state
    this.props.saveStep(step + 1)
    this.setState({ step: step + 1 })
  }

  previousStep = () => {
    const { step } = this.state
    this.props.saveStep(step - 1)
    this.setState({ step: step - 1 })
  }

  jumpStep = additionalSteps => {
    const { step } = this.state
    this.setState({ step: step + additionalSteps })
  }

  jumpToStart = () => {
    this.submitDraft()
    this.props.saveSurveyId(undefined) // reset the surveyId so resume draft doesnt show
    this.setState({ step: 1 })
  }

  setName = name => {
    this.setState({ surveyTakerName: name })
  }

  render() {
    let survey
    if(!this.props.location || !this.props.location.state){ this.props.history.push('/surveys')}
    if(this.props.location.state.surveyId && this.props.location.state.surveyId !== this.props.surveyStatus.surveyId){
      if (this.props.surveys) {
        survey = this.props.surveys.filter(
          survey => survey.id === this.props.location.state.surveyId
        )[0]
      }
      this.props.saveSurveyId(this.props.location.state.surveyId)
    } else if(this.props.surveyStatus.surveyId){
      survey = this.props.surveys.filter(
        survey => survey.id === this.props.surveyStatus.surveyId
      )[0]
    } else {
      // redirect to surveys
      // this..goback()
      // this.browserHistory.push('/surveys')
      this.props.history.push(`/surveys`)
    }

    let component = null
    switch (this.state.step) {
      case 1:
        component = survey && (
          <div>
            <TermsPrivacy
              parentNextStep={this.nextStep}
              prarentPreviousStep={this.previousStep}
              data={survey}
            />
          </div>
        )
        break
      case 2:
        // create draft at this point
        // draft should remain in state and is filled with answers from each component
        // might want to createa  function that creates the drafts
        // might want to create a handler for submissions of each step, to add to draft state.
        component = survey && (
          <div>
            <FamilyParticipant
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
              data={survey.surveyConfig}
              surveyId={this.props.location.state.surveyId}
              setName={this.setName}
              setDraftId={this.setDraftId}
              draftId={this.state.draftId}
              draftOngoing={this.state.draftOnGoing}
              draftIsOngoing={this.draftIsOngoing}
            />
          </div>
        )
        break
      case 3:
        component = (
          <div>
            <FamilyMembers
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
              surveyTakerName={this.state.surveyTakerName}
              jumpStep={this.jumpStep}
              memberCount={this.state.memberCount}
              setMemberCount={this.setMemberCount}
            />
          </div>
        )
        break
      case 4:
        component = (
          <div>
            <FamilyGender
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
              memberCount={this.state.memberCount}
              surveyTaker={this.state.surveyTakerName}
            />
          </div>
        )
        break
      case 5:
        component = (
          <div>
            <FamilyBirthDate
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
              memberCount={this.state.memberCount}
              surveyTaker={this.state.surveyTakerName}
            />
          </div>
        )
        break
      case 6:
        component = (
          <div>
            <FamilyMap
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
            />
          </div>
        )
        break
      case 7:
        component = survey && (
          <div>
            <SocioEconomic
              parentNextStep={this.nextStep}
              draftId={this.state.draftId}
              parentPreviousStep={this.previousStep}
              data={survey.surveyEconomicQuestions}
            />
          </div>
        )
        break
      case 8:
        component = (
          <div>
            <BeginLifemap
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
              data={survey.surveyStoplightQuestions.length}
            />
          </div>
        )
        break
      case 9:
        component = survey && (
          <div style={{ width: '760px' }}>
            <StopLight
              draftId={this.state.draftId}
              data={survey.surveyStoplightQuestions}
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
            />
          </div>
        )
        break
      case 10:
        component = survey && (
          <div>
            <IndicatorList
              draftId={this.state.draftId}
              data={survey.surveyStoplightQuestions}
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
              minimumPriorities={survey.minimumPriorities}
            />
          </div>
        )
        break
      case 11:
        component = survey && (
          <div>
            <FinalScreen
              draftId={this.state.draftId}
              data={survey.surveyStoplightQuestions}
              nextStep={this.jumpToStart}
              parentPreviousStep={this.previousStep}
            />
          </div>
        )
        break
      // Create a submit handler to send redux store of graph as graphql mutation once Prorities & Achievements is submitted
      default:
        component = <div>NOTHING TO SEE HERE</div>
    }
    return <div>{component}</div>
  }
}

const mapStateToProps = state => ({
  state: state,
  surveys: state.surveys,
  drafts: state.drafts,
  surveyStatus: state.surveyStatus
})
const mapDispatchToProps = {
  loadSurveys,
  submitDraft,
  saveStep,
  saveDraftId,
  saveSurveyId
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lifemap)
