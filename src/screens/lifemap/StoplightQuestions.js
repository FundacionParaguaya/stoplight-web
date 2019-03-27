import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'

export class StoplightQuestions extends Component {
  state = {
    question: null
  }
  handleContinue = () => {
    const currentQuestionPage = this.props.match.params.page
    if (
      currentQuestionPage <
      this.props.currentSurvey.surveyStoplightQuestions.length - 1
    ) {
      this.props.history.push(
        `/lifemap/stoplight/${parseInt(currentQuestionPage, 10) + 1}`
      )
    } else {
      this.props.history.push('/lifemap/overview')
    }
  }

  setCurrentScreen() {
    this.setState({
      question: this.props.currentSurvey.surveyStoplightQuestions[
        this.props.match.params.page
      ]
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
    const { question } = this.state

    return (
      <div>
        <h2>{question && question.questionText}</h2>

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
)(StoplightQuestions)
