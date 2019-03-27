import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'

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

    return (
      <div>
        <h2>{topic}</h2>

        {/* List of questions for current topic */}
        {questions &&
          questions.forFamily.map(question => (
            <p key={question.codeName}>{question.questionText}</p>
          ))}
        <Button variant="contained" fullWidth onClick={this.handleContinue}>
          Continue
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
)(Economics)
