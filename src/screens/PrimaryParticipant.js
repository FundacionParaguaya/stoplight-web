import React, { Component } from 'react'
import { connect } from 'react-redux'
import uuid from 'uuid/v1'
import { updateDraft } from '../redux/actions'

export class Terms extends Component {
  createNewDraft() {
    const { currentSurvey } = this.props

    // create draft skeleton
    this.props.updateDraft({
      draftId: uuid(), // generate unique id based on timestamp
      surveyId: currentSurvey.id,
      surveyVersionId: currentSurvey['surveyVersionId'],
      created: Date.now(),
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      priorities: [],
      achievements: [],
      familyData: {
        familyMembersList: [
          {
            firstParticipant: true,
            socioEconomicAnswers: []
          }
        ]
      }
    })
  }
  componentDidMount() {
    // if there is no current draft in the store create a new one
    if (!this.props.currentDraft) {
      this.createNewDraft()
    }
  }
  render() {
    console.log(this.props.currentDraft)
    return <div>Primary Participant</div>
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
})

const mapDispatchToProps = { updateDraft }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Terms)
