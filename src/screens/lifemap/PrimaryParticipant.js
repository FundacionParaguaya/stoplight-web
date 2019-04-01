import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
import uuid from 'uuid/v1'
import { updateDraft } from '../../redux/actions'
import TitleBar from '../../components/TitleBar'
import Input from '../../components/Input'
import Select from '../../components/Select'
import DatePicker from '../../components/DatePicker'

export class PrimaryParticipant extends Component {
  state = {
    householdSizeArray: []
  }

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

    // update only the first item of familyMembersList
    //  which is the primary participant
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

  updateFamilyMembersCount = event => {
    const { currentDraft } = this.props

    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        ...{ countFamilyMembers: event.target.value }
      }
    })
  }

  setHouseholdSizeArray() {
    const { t } = this.props
    const householdSizeArray = []

    for (var i = 1; i <= 26; i++) {
      householdSizeArray.push({
        value: i === 26 ? -1 : i,
        text:
          i === 1
            ? t('views.family.onlyPerson')
            : i === 26
            ? t('views.family.preferNotToSay')
            : `${i}`
      })
    }

    this.setState({
      householdSizeArray
    })
  }

  componentDidMount() {
    // if there is no current draft in the store create a new one
    if (!this.props.currentDraft) {
      this.createNewDraft()
    }

    this.setHouseholdSizeArray()
  }

  render() {
    const { t, currentSurvey } = this.props
    const { surveyConfig } = currentSurvey

    const participant = this.props.currentDraft
      ? this.props.currentDraft.familyData.familyMembersList[0]
      : {}

    return (
      <div>
        <TitleBar title={t('views.primaryParticipant')} />

        <Input
          label={t('views.family.firstName')}
          value={participant.firstName}
          onChange={e => this.updateDraft('firstName', e)}
        />

        <Input
          label={t('views.family.lastName')}
          value={participant.lastName}
          onChange={e => this.updateDraft('lastName', e)}
        />

        <Select
          label={t('views.family.selectGender')}
          value={participant.gender}
          onChange={e => this.updateDraft('gender', e)}
          options={surveyConfig.gender}
        />

        <DatePicker
          label={t('views.family.dateOfBirth')}
          onChange={e => this.updateDraft('birthDate', e)}
          value={participant.birthDate}
        />

        <Select
          label={t('views.family.documentType')}
          value={participant.documentType}
          onChange={e => this.updateDraft('documentType', e)}
          options={surveyConfig.documentType}
        />

        <Input
          label={t('views.family.documentNumber')}
          value={participant.documentNumber}
          onChange={e => this.updateDraft('documentNumber', e)}
        />

        <Select
          label={t('views.family.countryOfBirth')}
          value={participant.birthCountry}
          onChange={e => this.updateDraft('birthCountry', e)}
          country
        />

        <Select
          label={t('views.family.peopleLivingInThisHousehold')}
          value={
            this.props.currentDraft
              ? this.props.currentDraft.familyData.countFamilyMembers
              : null
          }
          onChange={this.updateFamilyMembersCount}
          options={this.state.householdSizeArray}
        />

        <Input
          label={t('views.family.email')}
          value={participant.email}
          onChange={e => this.updateDraft('email', e)}
        />

        <Input
          label={t('views.family.phone')}
          value={participant.phone}
          onChange={e => this.updateDraft('phone', e)}
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
