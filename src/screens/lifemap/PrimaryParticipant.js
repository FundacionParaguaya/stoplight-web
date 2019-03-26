import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import uuid from 'uuid/v1'
import { updateDraft } from '../../redux/actions'

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

  handleContinue = () => {
    // validation happens here
    this.props.history.push('/lifemap/location')
  }

  componentDidMount() {
    // if there is no current draft in the store create a new one
    if (!this.props.currentDraft) {
      this.createNewDraft()
    }
  }

  render() {
    return (
      <div>
        <h2>Primary Participant</h2>
        <Button variant="contained" fullWidth onClick={this.handleContinue}>
          Continue
        </Button>
      </div>
    )
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
