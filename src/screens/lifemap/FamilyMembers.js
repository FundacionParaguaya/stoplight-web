import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'
import Form from '../../components/Form'
import Input from '../../components/Input'
import TextField from '@material-ui/core/TextField'
import ContainerSmall from '../../components/ContainerSmall'
import Select from '../../components/Select'
import Typography from '@material-ui/core/Typography'
import DatePicker from '../../components/DatePicker'
export class FamilyMembers extends Component {
  updateDraft = (memberIndex, value, property) => {
    const { currentDraft } = this.props

    // update only the family member that is edited
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: currentDraft.familyData.familyMembersList.map(
          (item, index) => {
            if (memberIndex - 1 === index) {
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
    const membersList = currentDraft.familyData.familyMembersList.slice(0)
    const { surveyConfig } = currentSurvey
    return (
      <div>
        <TitleBar title={t('views.familyMembers')} />
        <ContainerSmall>
          <Form
            onSubmit={this.handleContinue}
            submitLabel={t('general.continue')}
          >
            {membersList.map((item, index) => {
              if (index === 0) {
                return (
                  <div key={index}>
                    <Typography
                      style={{ marginTop: '20px', marginBottom: '16px' }}
                      variant="h6"
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i
                          class="material-icons"
                          style={{ marginRight: 7, fontSize: 35 }}
                        >
                          face
                        </i>
                        {t('views.family.familyMember')} {index + 1} -{' '}
                        {t('views.primaryParticipant')}
                      </span>
                    </Typography>
                    <TextField
                      disabled
                      field={index + 1}
                      label={`${t('views.family.firstName')}`}
                      value={item.firstName}
                      margin="dense"
                      fullWidth
                    />

                    <Select
                      disabled
                      label={t('views.family.selectGender')}
                      value={item.gender}
                      field={index + 1}
                      onChange={(index, value) =>
                        this.updateDraft(index, value, 'gender')
                      }
                      options={surveyConfig.gender}
                    />
                    <DatePicker
                      disabled
                      label={t('views.family.dateOfBirth')}
                      field={index + 1}
                      onChange={(index, value) =>
                        this.updateDraft(index, value, 'birthDate')
                      }
                      value={item.birthDate}
                    />
                  </div>
                )
              } else {
                return (
                  <div key={index}>
                    <Typography
                      style={{ marginTop: '20px', marginBottom: '16px' }}
                      variant="h6"
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i
                          class="material-icons"
                          style={{ marginRight: 7, fontSize: 35 }}
                        >
                          face
                        </i>
                        {t('views.family.familyMember')} {index + 1}
                      </span>
                    </Typography>
                    <Input
                      required
                      field={index + 1}
                      label={`${t('views.family.firstName')}`}
                      value={item.firstName}
                      onChange={(index, value) =>
                        this.updateDraft(index, value, 'firstName')
                      }
                    />

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
                )
              }
            })}
          </Form>
        </ContainerSmall>
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
