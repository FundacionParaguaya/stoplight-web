import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { updateDraft } from '../../redux/actions'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'
import Select from '../../components/Select'
import DatePicker from '../../components/DatePicker'
class GenderAndBirthrates extends Component {
  updateDraftGender = (field, event, index) => {
    const { currentDraft } = this.props
    let currList = currentDraft.familyData.familyMembersList
    currList[index].gender = event.target.value
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: currList
      }
    })
  }
  updateDraftBirthDate = (field, event, index) => {
    const { currentDraft } = this.props
    let currList = currentDraft.familyData.familyMembersList
    currList[index].birthDate = event.target.value
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: currList
      }
    })
  }
  handleContinue = () => {
    this.props.history.push('/lifemap/location')
  }

  render() {
    const { classes, t, currentDraft, currentSurvey } = this.props
    const { surveyConfig } = currentSurvey
    return (
      <div>
        <TitleBar title={t('views.gendersBirthDates')} />

        {currentDraft.familyData.familyMembersList.map((e, index) => {
          if (!e.firstParticipant) {
            return (
              <div>
                <div> {e.firstName}</div>
                <Select
                  label={t('views.family.selectGender')}
                  value={e.gender}
                  onChange={e => this.updateDraftGender('gender', e, index)}
                  options={surveyConfig.gender}
                />
                <DatePicker
                  label={t('views.family.dateOfBirth')}
                  onChange={e =>
                    this.updateDraftBirthDate('birthDate', e, index)
                  }
                  value={e.birthDate}
                />
              </div>
            )
          }
        })}
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

const styles = {
  primaryParticipan: {
    marginTop: 40,
    marginBottom: 60
  },
  container: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
})

const mapDispatchToProps = { updateDraft }
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(GenderAndBirthrates))
)
