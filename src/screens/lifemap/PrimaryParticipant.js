import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
import uuid from 'uuid/v1'
import { updateDraft } from '../../redux/actions'
import TitleBar from '../../components/TitleBar'
import Input from '../../components/Input'
import Select from '../../components/Select'

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
    const { t, currentSurvey } = this.props
    const { surveyConfig } = currentSurvey

    const participant = this.props.currentDraft
      ? this.props.currentDraft.familyData.familyMembersList[0]
      : {}

    console.log(participant)

    return (
      <div>
        <TitleBar title={t('views.primaryParticipant')} />

        <Input
          label={t('views.family.firstName')}
          value={participant.firstName || ''}
          onChange={e => this.updateDraft('firstName', e)}
        />

        <Input
          label={t('views.family.lastName')}
          value={participant.lastName || ''}
          onChange={e => this.updateDraft('lastName', e)}
        />

        <Select
          label={t('views.family.gender')}
          value={participant.gender}
          onChange={e => this.updateDraft('gender', e)}
          options={surveyConfig.gender}
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
