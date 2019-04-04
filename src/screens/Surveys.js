import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { updateUser, updateSurvey, updateDraft } from '../redux/actions'
import { getSurveys } from '../api'

export class Surveys extends Component {
  state = { surveys: [], loading: true }

  setupUser(token) {
    const user = {
      username: 'cannot get user name at this stage',
      token,
      env:
        document.referrer.split('.').length > 1
          ? document.referrer.split('.')[0].split('//')[1]
          : 'testing'
    }
    this.props.updateUser(user)
    this.getSurveys(user)
  }

  getSurveys(user) {
    console.log(this.props.user)
    getSurveys(user || this.props.user)
      .then(response => {
        this.setState({
          surveys: response.data.data.surveysByUser
        })
      })
      .catch(error => console.log(error))
      .finally(() =>
        this.setState({
          loading: false
        })
      )
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

    // check for user token from the location params,
    // else check if there is one in the store
    if (this.props.location.search.match(/sid=(.*)&/)) {
      const token = this.props.location.search.match(/sid=(.*)&/)[1]
      if (this.props.user && token !== this.props.user.token) {
        this.setupUser(token)
      } else {
        this.getSurveys()
      }
    } else {
      this.getSurveys()
    }
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <h1>Surveys</h1>
        <div className={classes.list}>
          {this.state.loading && (
            <div className={classes.spinnerWrapper}>
              <CircularProgress size={50} thickness={2} />
            </div>
          )}
          {this.state.surveys.map(survey => (
            <Button
              variant="contained"
              className={classes.button}
              key={survey.id}
              onClick={() => this.handleClickOnSurvey(survey)}
              fullWidth
            >
              {survey.title}
            </Button>
          ))}
        </div>
      </React.Fragment>
    )
  }
}

const styles = {
  spinnerWrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
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
