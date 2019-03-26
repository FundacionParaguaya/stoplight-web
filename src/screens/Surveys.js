import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { updateUser, updateSurvey } from '../redux/actions'
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

  handleClickOnSurvey = survey => {
    this.props.updateSurvey(survey)
    this.props.history.push('/lifemap/terms')
  }

  componentDidMount() {
    // check for user token from the location params
    const token =
      (this.props.user && this.props.user.token) ||
      (this.props.location.search.match(/sid=(.*)&/)
        ? this.props.location.search.match(/sid=(.*)&/)[1]
        : null)

    if (!this.props.user && token) {
      this.setupUser(token)
    }

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

const mapDispatchToProps = { updateUser, updateSurvey }

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Surveys)
  )
)
