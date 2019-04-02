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
  //   componentDidMount() {
  //     const { currentDraft } = this.props
  //     if (currentDraft.familyData.familyMembersList.length < 2) {
  //       console.log('fresh')
  //       let names = []
  //       names.push(currentDraft.familyData.familyMembersList[0])
  //       for (let i = 1; i <= currentDraft.familyData.countFamilyMembers; i++) {
  //         names.push({ firstName: '', gender: '', birthDate: '' })
  //       }
  //       this.props.updateDraft({
  //         ...currentDraft,
  //         familyData: {
  //           ...currentDraft.familyData,
  //           familyMembersList: names
  //         }
  //       })
  //     } else if (
  //       currentDraft.familyData.familyMembersList.length - 1 <
  //       currentDraft.familyData.countFamilyMembers
  //     ) {
  //       console.log(currentDraft.familyData.countFamilyMembers)
  //       console.log('plus')
  //       let names2 = currentDraft.familyData.familyMembersList
  //       for (
  //         let i = currentDraft.familyData.familyMembersList.length;
  //         i <= currentDraft.familyData.countFamilyMembers;
  //         i++
  //       ) {
  //         names2.push({ firstName: '', gender: '', birthDate: '' })
  //       }
  //       this.props.updateDraft({
  //         ...currentDraft,
  //         familyData: {
  //           ...currentDraft.familyData,
  //           familyMembersList: names2
  //         }
  //       })
  //     } else if (
  //       currentDraft.familyData.familyMembersList.length - 1 >
  //       currentDraft.familyData.countFamilyMembers
  //     ) {
  //       let names3 = currentDraft.familyData.familyMembersList
  //       let deleteFrom =
  //         currentDraft.familyData.familyMembersList.length -
  //         1 -
  //         currentDraft.familyData.countFamilyMembers

  //       console.log('minus')
  //       names3.splice(-deleteFrom, deleteFrom)

  //       this.props.updateDraft({
  //         ...currentDraft,
  //         familyData: {
  //           ...currentDraft.familyData,
  //           familyMembersList: names3
  //         }
  //       })
  //     }
  //   }

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
