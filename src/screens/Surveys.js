import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { updateUser, updateSurvey, updateDraft } from '../redux/actions'
import { getSurveys } from '../api'

export class Surveys extends Component {
  constructor(props) {
    super(props)
    this.state = { surveys: [] }
  }

  setupUser(token) {
    this.props.updateUser({
      username: 'cannot get user name at this stage',
      token,
      env:
        document.referrer.split('.').length > 1
          ? document.referrer.split('.')[0].split('//')[1]
          : 'testing'
    })
  }

  getSurveys() {
    getSurveys(this.props.user)
      .then(response => {
        this.setState({
          surveys: response.data.data.surveysByUser
        })
      })
      .catch(error => {})
  }

  getEconomicScreens(survey) {
    let currentDimension = ''
    let questionsPerScreen = []
    let totalScreens = 0

    // go trough all questions and separate them by screen
    survey.surveyEconomicQuestions.forEach(question => {
      // if the dimention of the questions change, change the page
      if (question.topic !== currentDimension) {
        currentDimension = question.topic
        totalScreens += 1
      }

      // if there is object for n screen create one
      if (!questionsPerScreen[totalScreens - 1]) {
        questionsPerScreen[totalScreens - 1] = {
          forFamilyMember: [],
          forFamily: []
        }
      }

      if (question.forFamilyMember) {
        questionsPerScreen[totalScreens - 1].forFamilyMember.push(question)
      } else {
        questionsPerScreen[totalScreens - 1].forFamily.push(question)
      }
    })

    return {
      questionsPerScreen
    }
  }

  handleClickOnSurvey = survey => {
    const economicScreens = this.getEconomicScreens(survey)
    this.props.updateSurvey({ ...survey, economicScreens })
    this.props.history.push('/lifemap/terms')
  }

  componentDidMount() {
    // clear current draft from store
    this.props.updateDraft(null)
    this.props.updateSurvey(null)

    let token = null

    // check for user token from the location params,
    // else check if there is one in the store
    if (this.props.location.search.match(/sid=(.*)&/)) {
      token = this.props.location.search.match(/sid=(.*)&/)[1]
    } else if (this.props.user.token) {
      token = this.props.user.token
    }

    this.setupUser(token)

    if (this.props.user) {
      this.getSurveys()
    }
  }

  componentDidUpdate(prevProps) {
    // when user is setup in store, get the surveys
    if (!prevProps.user && this.props.user) {
      this.getSurveys()
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <h1>Surveys</h1>
        <div className={classes.list}>
          {this.state.surveys.map(survey => (
            <Button
              variant="contained"
              className={classes.button}
              key={survey.id}
              onClick={() => this.handleClickOnSurvey(survey)}
            >
              {survey.title}
            </Button>
          ))}
        </div>
      </div>
    )
  }
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    marginBottom: 20
  }
}

const mapStateToProps = ({ user }) => ({ user })

const mapDispatchToProps = { updateUser, updateSurvey, updateDraft }

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Surveys)
  )
)
