import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import uuid from 'uuid/v1'
import { updateDraft } from '../../redux/actions'
import TitleBar from '../../components/TitleBar'
import Form from '../../components/Form'
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
    const { currentDraft } = this.props

    if (currentDraft.familyData.countFamilyMembers === 1) {
      this.props.history.push('/lifemap/location')
    } else {
      this.props.history.push('/lifemap/family-members')
    }
  }

  updateDraft = (field, value) => {
    const { currentDraft } = this.props

    // update only the first item of familyMembersList
    //  which is the primary participant
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: [
          {
            ...currentDraft.familyData.familyMembersList[0],
            ...{
              [field]: value
            }
          },
          ...currentDraft.familyData.familyMembersList.slice(1)
        ]
      }
    })
  }

  updateFamilyMembersCount = async (field, value) => {
    const { currentDraft } = this.props

    if (value === 1) {
      let name = currentDraft.familyData.familyMembersList
      name.splice(1)
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          ...{ countFamilyMembers: value },
          familyMembersList: name
        }
      })
    } else if (currentDraft.familyData.familyMembersList.length < value) {
      let names2 = currentDraft.familyData.familyMembersList
      for (
        let i = currentDraft.familyData.familyMembersList.length;
        i <= value - 1;
        i++
      ) {
        names2.push({ firstName: '', gender: '', birthDate: '' })
      }
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          ...{ countFamilyMembers: value },
          familyMembersList: names2
        }
      })
    } else if (currentDraft.familyData.familyMembersList.length > value) {
      let names3 = currentDraft.familyData.familyMembersList
      let deleteFrom = currentDraft.familyData.familyMembersList.length - value
      names3.splice(-deleteFrom, deleteFrom)

      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          ...{ countFamilyMembers: value },
          familyMembersList: names3
        }
      })
    }
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

  componentDidMount = async () => {
    // if there is no current draft in the store create a new one

    if (!this.props.currentDraft) {
      await this.createNewDraft()
    }
    if (this.props.currentDraft) {
      if (
        !this.props.currentDraft.familyData.familyMembersList[0].birthCountry
      ) {
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
                  birthCountry: this.props.currentSurvey.surveyConfig
                    .surveyLocation.country
                }
              },
              ...currentDraft.familyData.familyMembersList.slice(1)
            ]
          }
        })
      }
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
        <Form
          onSubmit={this.handleContinue}
          submitLabel={t('general.continue')}
        >
          <Input
            required
            label={t('views.family.firstName')}
            value={participant.firstName}
            field="firstName"
            onChange={this.updateDraft}
          />
          <Input
            required
            label={t('views.family.lastName')}
            value={participant.lastName}
            field="lastName"
            onChange={this.updateDraft}
          />
          <Select
            required
            label={t('views.family.selectGender')}
            value={participant.gender}
            field="gender"
            onChange={this.updateDraft}
            options={surveyConfig.gender}
          />
          <DatePicker
            required
            label={t('views.family.dateOfBirth')}
            field="birthDate"
            onChange={this.updateDraft}
            value={participant.birthDate}
          />
          <Select
            required
            label={t('views.family.documentType')}
            value={participant.documentType}
            field="documentType"
            onChange={this.updateDraft}
            options={surveyConfig.documentType}
          />
          <Input
            required
            label={t('views.family.documentNumber')}
            value={participant.documentNumber}
            field="documentNumber"
            onChange={this.updateDraft}
          />
          <Select
            required
            label={t('views.family.countryOfBirth')}
            value={
              participant.birthCountry ||
              currentSurvey.surveyConfig.surveyLocation.country
            }
            field="birthCountry"
            onChange={this.updateDraft}
            country
          />
          <Select
            required
            label={t('views.family.peopleLivingInThisHousehold')}
            value={
              this.props.currentDraft
                ? this.props.currentDraft.familyData.countFamilyMembers
                : null
            }
            field="countFamilyMembers"
            onChange={this.updateFamilyMembersCount}
            options={this.state.householdSizeArray}
          />
          <Input
            label={t('views.family.email')}
            value={participant.email}
            field="email"
            onChange={this.updateDraft}
          />
          <Input
            label={t('views.family.phone')}
            value={participant.phone}
            field="phone"
            onChange={this.updateDraft}
          />
        </Form>
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
