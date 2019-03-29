import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import TitleBar from '../../components/TitleBar'
import { withTranslation } from 'react-i18next'
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
  skipQuestion = () => {
    let { codeName, dimension, questionText } = this.state.question
    const { currentDraft } = this.props
    let dataList = this.props.currentDraft.indicatorSurveyDataList
    let update = false
    //////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST AND UPDATE my dataList
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true
        e.value = 0
        e.dimension = dimension
        e.questionText = questionText
      }
    })
    ///////////if the question is in the data list then update the question
    if (update) {
      let indicatorSurveyDataList = dataList
      this.props.updateDraft({
        ...currentDraft,
        indicatorSurveyDataList
      })
      this.handleContinue()
    } else {
      //////////// add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        indicatorSurveyDataList: [
          ...currentDraft.indicatorSurveyDataList,
          {
            key: codeName,
            value: 0,
            dimension: dimension,
            questionText: questionText
          }
        ]
      })
      this.handleContinue()
    }
  }
  submitQuestion(value) {
    let { codeName, dimension, questionText } = this.state.question
    const { currentDraft } = this.props
    let dataList = this.props.currentDraft.indicatorSurveyDataList
    let update = false
    //////////////// CHECK IF THE QUESTION IS ALREADY IN THE DATA LIST and if it is the set update to true and edit the answer
    dataList.forEach(e => {
      if (e.key === codeName) {
        update = true
        e.value = value
        e.dimension = dimension
        e.questionText = questionText
      }
    })
    ///////////if the question is in the data list then update the question
    if (update) {
      let indicatorSurveyDataList = dataList
      this.props.updateDraft({
        ...currentDraft,
        indicatorSurveyDataList
      })
      this.handleContinue()
    } else {
      //////////// add the question to the data list if it doesnt exist
      this.props.updateDraft({
        ...currentDraft,
        indicatorSurveyDataList: [
          ...currentDraft.indicatorSurveyDataList,
          {
            key: codeName,
            value: value,
            dimension: dimension,
            questionText: questionText
          }
        ]
      })
      this.handleContinue()
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
    const { question } = this.state
    const { classes, t } = this.props

    let sortedQuestions
    if (question) {
      sortedQuestions = question.stoplightColors
      let compare = (a, b) => {
        if (a.value < b.value) return 1
        if (a.value > b.value) return -1
        return 0
      }
      sortedQuestions.sort(compare)
    }
    return (
      <div>
        <TitleBar title="Your life map" />
        <p className={classes.questionDimension}>
          {question && question.dimension}
        </p>
        <h2 className={classes.questionTextTitle}>
          {question && question.questionText}
        </h2>
        <div className={classes.mainQuestionsContainer}>
          {question !== null
            ? sortedQuestions.map(e => {
                let color
                if (e.value === 3) {
                  color = '#89bd76'
                } else if (e.value === 2) {
                  color = '#f0cb17'
                } else if (e.value === 1) {
                  color = '#e1504d'
                }

                return (
                  <div
                    key={e.value}
                    onClick={() => this.submitQuestion(e.value)}
                    className={classes.questionContainer}
                  >
                    <img
                      className={classes.questionImage}
                      src={e.url}
                      alt="surveyImg"
                    />
                    <p
                      style={{ backgroundColor: color }}
                      className={classes.questionDescription}
                    >
                      {e.description}
                    </p>
                  </div>
                )
              })
            : null}
        </div>
        {question && !question.required ? (
          <Button onClick={this.skipQuestion}>
            {t('views.lifemap.skipThisQuestion')}
          </Button>
        ) : null}
      </div>
    )
  }
}

const styles = {
  skipButton: {
    cursor: 'pointer'
  },
  questionTextTitle: {
    textAlign: 'center',
    margin: '4px 0 10px 0',
    color: '#444'
  },
  questionDimension: {
    fontSize: 24,
    textAlign: 'center',
    color: 'grey',
    margin: 0,
    marginTop: 10
  },
  questionImage: {
    objectFit: 'cover',
    height: 150
  },
  questionDescription: {
    margin: 0,
    textAlign: 'center',
    color: 'white',
    height: '100%',
    padding: '20px 20px'
  },
  questionContainer: {
    cursor: 'pointer',
    width: 230,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '20px'
  },
  mainQuestionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
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
  )(withTranslation()(StoplightQuestions))
)
