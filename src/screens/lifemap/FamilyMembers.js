import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { updateDraft } from '../../redux/actions'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'
import Input from '../../components/Input'
import TextField from '@material-ui/core/TextField'
export class FamilyMembers extends Component {
  updateDraft = (event, index) => {
    const { currentDraft } = this.props
    let currList = currentDraft.familyData.familyMembersList
    currList[index].firstName = event.target.value
    this.props.updateDraft({
      ...currentDraft,
      familyData: {
        ...currentDraft.familyData,
        familyMembersList: currList
      }
    })
  }
  handleContinue = () => {
    this.props.history.push('/lifemap/gender-and-birthrates')
  }

  render() {
    const { classes, t, currentDraft } = this.props
    return (
      <div>
        <TitleBar title={t('views.familyMembers')} />
        <div className={classes.container}>
          {currentDraft.familyData.familyMembersList.map((e, index) => {
            if (e.firstParticipant) {
              return (
                <TextField
                  disabled
                  key={index}
                  label={t('views.family.firstName')}
                  value={e.firstName}
                  margin="dense"
                  className={e.firstName}
                />
              )
            } else {
              return (
                <Input
                  key={index}
                  label={t('views.family.familyMember')}
                  value={e.firstName}
                  margin="dense"
                  onChange={e => this.updateDraft(e, index)}
                />
              )
            }
          })}
        </div>
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
  )(withTranslation()(FamilyMembers))
)
