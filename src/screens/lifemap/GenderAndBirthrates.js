import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withTranslation } from 'react-i18next'
import { updateDraft } from '../../redux/actions'
import TitleBar from '../../components/TitleBar'
import Select from '../../components/Select'
import DatePicker from '../../components/DatePicker'
class GenderAndBirthrates extends Component {
  updateDraft = (memberIndex, value, property) => {
    const { currentDraft } = this.props

    // update only the family member that is edited
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: currentDraft.familyData.familyMembersList.map(
          (item, index) => {
            if (memberIndex === index) {
              return {
                ...item,
                [property]: value
              }
            } else {
              return item
            }
          }
        )
      }
    })
  }

  handleContinue = () => {
    this.props.history.push('/lifemap/location')
  }

  render() {
    const { t, currentDraft, currentSurvey } = this.props
    const { surveyConfig } = currentSurvey
    const membersList = currentDraft.familyData.familyMembersList.slice(0)

    return (
      <div>
        <TitleBar title={t('views.gendersBirthDates')} />

        {membersList.slice(1).map((item, index) => (
          <div key={index}>
            <Typography variant="h4">{item.firstName}</Typography>
            <Select
              label={t('views.family.selectGender')}
              value={item.gender}
              field={index + 1}
              onChange={(index, value) =>
                this.updateDraft(index, value, 'gender')
              }
              options={surveyConfig.gender}
            />
            <DatePicker
              label={t('views.family.dateOfBirth')}
              field={index + 1}
              onChange={(index, value) =>
                this.updateDraft(index, value, 'birthDate')
              }
              value={item.birthDate}
            />
          </div>
        ))}
        <Button
          color="primary"
          onClick={this.handleContinue}
          variant="contained"
          fullWidth
        >
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
)(withTranslation()(GenderAndBirthrates))
