import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'
import Form from '../../components/Form'
import Input from '../../components/Input'
import TextField from '@material-ui/core/TextField'
export class FamilyMembers extends Component {
  updateDraft = (memberIndex, firstName) => {
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
                firstName
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
    this.props.history.push('/lifemap/gender-and-birthrates')
  }

  render() {
    const { t, currentDraft } = this.props
    const { familyMembersList } = currentDraft.familyData

    const membersList = currentDraft.familyData.familyMembersList.slice(0)

    return (
      <div>
        <TitleBar title={t('views.familyMembers')} />
        <TextField
          disabled
          label={`${t('views.family.familyMember')} 1 - ${t(
            'views.family.participant'
          )}`}
          value={`${familyMembersList[0].firstName} ${
            familyMembersList[0].lastName
          }`}
          margin="dense"
          fullWidth
        />
        <Form
          onSubmit={this.handleContinue}
          submitLabel={t('general.continue')}
        >
          {membersList.slice(1).map((item, index) => (
            <Input
              required
              key={index}
              field={index + 1}
              label={`${t('views.family.familyMember')} ${index + 2}`}
              value={item.firstName}
              onChange={this.updateDraft}
            />
          ))}
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
)(withTranslation()(FamilyMembers))
