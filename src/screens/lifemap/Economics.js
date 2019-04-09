import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'
import Input from '../../components/Input'
import Select from '../../components/Select'
// import Select from '@material-ui/core/Select'
import Form from '../../components/Form'
export class Economics extends Component {
  state = {
    questions: null,
    topic: ''
  }
  handleContinue = () => {
    // validation happens here

    const currentEconomicsPage = this.props.match.params.page

    if (
      currentEconomicsPage <
      this.props.currentSurvey.economicScreens.questionsPerScreen.length - 1
    ) {
      this.props.history.push(
        `/lifemap/economics/${parseInt(currentEconomicsPage, 10) + 1}`
      )
    } else {
      this.props.history.push('/lifemap/begin-stoplight')
    }
  }

  setCurrentScreen() {
    const questions = this.props.currentSurvey.economicScreens
      .questionsPerScreen[this.props.match.params.page]

    this.setState({
      questions,
      topic: questions.forFamily[0].topic
    })
  }

  updateFamilyMember = (codeName, value, question, familyName) => {
    const { currentDraft } = this.props
    let FamilyMembersDataList = this.props.currentDraft.familyData
      .familyMembersList
    let update = false
    //////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    FamilyMembersDataList.forEach(e => {
      if (e.firstName === familyName) {
        e.socioEconomicAnswers.forEach(e => {
          if (e.key === question.codeName) {
            update = true
            e.value = value
          }
        })
      }
    })
    if (update) {
      let familyMembersList = FamilyMembersDataList
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          familyMembersList
        }
      })
    } else {
      let familyMembersList = FamilyMembersDataList
      FamilyMembersDataList.forEach(e => {
        if (e.firstName === familyName) {
          e.socioEconomicAnswers.push({
            key: question.codeName,
            value: value
          })
        }
      })
      //////////// add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        familyData: {
          ...currentDraft.familyData,
          familyMembersList
        }
      })
    }
  }
  setFamilyMemberName = e => {
    console.log(e)
  }

  updateDraft = (codeName, value) => {
    const { currentDraft } = this.props
    let dataList = this.props.currentDraft.economicSurveyDataList
    let update = false
    //////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true
        e.value = value
      }
    })

    ///////////if the question is in the data list then update the question
    if (update) {
      let economicSurveyDataList = dataList
      this.props.updateDraft({
        ...currentDraft,
        economicSurveyDataList
      })
    } else {
      //////////// add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        economicSurveyDataList: [
          ...currentDraft.economicSurveyDataList,
          {
            key: codeName,
            value: value
          }
        ]
      })
    }
  }
  componentDidMount() {
    this.setCurrentScreen()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.page !== this.props.match.params.page) {
      this.setCurrentScreen()
    }
  }

  render() {
    const { questions, topic } = this.state
    const { t, currentDraft, classes } = this.props
    return (
      <div>
        <TitleBar title={topic} />
        <Form
          onSubmit={this.handleContinue}
          submitLabel={t('general.continue')}
        >
          <React.Fragment>
            {/* List of questions for current topic */}

            {questions &&
              questions.forFamily.map(question => {
                let selectValue
                currentDraft.economicSurveyDataList.forEach(e => {
                  if (e.key === question.codeName) {
                    selectValue = e.value
                  }
                })
                if (question.answerType === 'select') {
                  return (
                    <Select
                      key={question.codeName}
                      label={question.questionText}
                      value={selectValue}
                      options={question.options}
                      field={question.codeName}
                      onChange={this.updateDraft}
                    />
                  )
                } else {
                  return (
                    <Input
                      key={question.codeName}
                      required={question.required}
                      label={question.questionText}
                      value={selectValue}
                      field={question.codeName}
                      onChange={this.updateDraft}
                    />
                  )
                }
              })}

            {questions &&
            this.props.match.params.page === '0' &&
            questions.forFamilyMember.length ? (
              <React.Fragment>
                {currentDraft.familyData.familyMembersList.map(
                  (familyMember, index) => {
                    // console.log(familyMember, index)
                    if (!familyMember.firstParticipant) {
                      return (
                        <React.Fragment key={familyMember.firstName}>
                          <div className={classes.familyMemberNameLarge}>
                            {familyMember.firstName}
                          </div>

                          <React.Fragment>
                            {' '}
                            {questions &&
                              questions.forFamilyMember.map(question => {
                                let selectValue

                                currentDraft.familyData.familyMembersList[
                                  index
                                ].socioEconomicAnswers.forEach(ele => {
                                  if (ele.key === question.codeName) {
                                    selectValue = ele.value
                                  }
                                })

                                if (question.answerType === 'select') {
                                  return (
                                    <Select
                                      key={question.codeName}
                                      label={question.questionText}
                                      value={selectValue}
                                      options={question.options}
                                      field={question.codeName}
                                      onChange={(event, child) =>
                                        this.updateFamilyMember(
                                          event,
                                          child,
                                          question,
                                          familyMember.firstName
                                        )
                                      }
                                    />
                                  )
                                } else {
                                  return (
                                    <Input
                                      key={question.codeName}
                                      required={question.required}
                                      label={question.questionText}
                                      value={selectValue}
                                      field={question.codeName}
                                      onChange={(event, child) =>
                                        this.updateFamilyMember(
                                          event,
                                          child,
                                          question,
                                          familyMember.firstName
                                        )
                                      }
                                    />
                                  )
                                }
                              })}
                          </React.Fragment>
                        </React.Fragment>
                      )
                    }
                  }
                )}
              </React.Fragment>
            ) : null}
          </React.Fragment>
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
const styles = {
  familyMemberNameLarge: {
    marginTop: '15px',
    marginBottom: '-10px',
    fontSize: '23px'
  }
}
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Economics))
)
