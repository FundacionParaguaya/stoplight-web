import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'

import { logout, login } from './redux/actions'
import i18n from './i18n'
import Surveys from './containers/Surveys'
import Lifemap from './containers/Lifemap'

import Dots from './components/Dots'


function getParams(location) {
  const searchParams = new URLSearchParams(location.search)
  let env = document.referrer.split('.')[0].split('//')[1] || 'testing'
  console.log(env)
  switch (env) {
    case 'testing':
      env = 'test'
      break
    case 'demo':
      env = 'demo'
      break
    case 'platform':
      env = 'prod'
      break
    default:
  }
  return {
    sid: searchParams.get('sid') || '',
    username: searchParams.get('username') || '',
    env: env
  }
}

/**
 * This is the Entry Pyont
 * @param {object} state - redux state that contains user information
 */
class App extends Component {
  constructor(props) {
    super(props)
    let url = new URL(window.location)
    this.state = {
      urlParams: getParams(window.location)
    }

    if (this.state.urlParams.sid !== '') {
      this.props.setLogin(this.state.urlParams.sid, this.state.urlParams.env)
    }

    if (url.searchParams.get("lang")) {
      let lang = url.searchParams.get("lang")
      i18n.changeLanguage(lang)
    }
  }
  render() {
    if(this.props.state.user.token){
      return (
        <Router>
        <div>
        <Dots />
        <div className="main-card card">
        <Switch>
        <Route exact path="/surveys" component={Surveys} />
        <Route exact path="/lifemap" component={Lifemap} />
        </Switch>
        </div>
        </div>
        </Router>
      )
    } else { return <div> <Dots/></div>}

  }
}

const mapStateToProps = state => ({
  state: state
})
const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout())
  },
  setLogin: (token, env) => {
    dispatch(login(token, env))
  }
})

export default (App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
