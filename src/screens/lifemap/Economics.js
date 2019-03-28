import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import TitleBar from '../../components/TitleBar'

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
    const { t } = this.props
    return (
      <div>
        <TitleBar title={topic} />
        {/* List of questions for current topic */}
        {questions &&
          questions.forFamily.map(question => (
            <p key={question.codeName}>{question.questionText}</p>
          ))}
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
