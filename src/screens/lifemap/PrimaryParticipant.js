import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import uuid from 'uuid/v1'
import { updateDraft } from '../../redux/actions'

export class PrimaryParticipant extends Component {
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

  updateDraft = (field, event) => {
    const { currentDraft } = this.props

    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: [
          ...currentDraft.familyData.familyMembersList.slice(0, 0),
          {
            ...currentDraft.familyData.familyMembersList[0],
            ...{
              [field]: event.target.value
            }
          },
          ...currentDraft.familyData.familyMembersList.slice(1)
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
    const { t } = this.props
    const participant = this.props.currentDraft.familyData.familyMembersList[0]

    console.log(this.props.currentSurvey.surveyConfig.documentType)

    return (
      <div>
        <h2>{t('views.primaryParticipant')}</h2>
        <TextField
          label={t('views.family.firstName')}
          value={participant.firstName || ''}
          fullWidth
          onChange={e => this.updateDraft('firstName', e)}
          margin="normal"
        />
        <TextField
          label={t('views.family.lastName')}
          value={participant.lastName || ''}
          fullWidth
          onChange={e => this.updateDraft('lastName', e)}
          margin="normal"
        />
        <Button variant="contained" fullWidth onClick={this.handleContinue}>
          {t('general.continue')}
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
)(withTranslation()(PrimaryParticipant))
