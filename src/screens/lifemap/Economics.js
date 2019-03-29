import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'
import Input from '../../components/Input'
import Select from '../../components/Select'
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
  updateDraft(codeName, answer) {
    const { currentDraft } = this.props
    let dataList = this.props.currentDraft.economicSurveyDataList
    let update = false
    //////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true
        e.value = answer.target.value
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
            value: answer.target.value
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
    const { t, currentDraft } = this.props
    console.log(questions)
    console.log(currentDraft)
    return (
      <div>
        <TitleBar title={topic} />
        {/* List of questions for current topic */}

        {questions &&
          questions.forFamily.map(q => {
            let selectValue
            currentDraft.economicSurveyDataList.forEach(e => {
              if (e.key === q.codeName) {
                selectValue = e.value
              }
            })
            if (q.answerType === 'select') {
              return (
                <div key={q.codeName}>
                  <Select
                    label={q.questionText}
                    value={selectValue}
                    onChange={e => this.updateDraft(q.codeName, e)}
                    options={q.options}
                  />
                </div>
              )
            } else {
              return (
                <div key={q.codeName}>
                  <Input
                    label={q.questionText}
                    value={selectValue}
                    onChange={e => this.updateDraft(q.codeName, e)}
                  />
                </div>
              )
            }
          })}

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
const styles = {}
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(Economics))
)
