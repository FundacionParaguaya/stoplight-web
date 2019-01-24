import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'

import { logout, login } from './redux/actions'
import Login from './containers/Login'
import Dashboard from './containers/Dashboard'
import Families from './containers/Families'
import Family from './containers/Family'
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
    this.state = {
      urlParams: getParams(window.location)
    }
    if (this.state.urlParams.sid) {
      this.props.logout() // always logout first
      this.props.setLogin(this.state.urlParams.sid, this.state.urlParams.env)
    }
  }
  render() {
    if (this.state.urlParams.sid) {
      return (
        <Router>
          <div>
            <Dots />
            <div className="container-fluid">
              <div className="row" />
              <a href="https://testing.povertystoplight.org">
                {' '}
                <button className="btn"> Go Back to the Platform </button>{' '}
              </a>
            </div>
            <div className="row">
              <main
                role="main"
                className="col-md-12 ml-sm-12 col-lg-12 px-4 main"
              >
                <div>
                  <Switch>
                    <Route exact path="/surveys" component={Surveys} />
                    <Route exact path="/lifemap" component={Lifemap} />
                  </Switch>
                </div>
              </main>
            </div>
          </div>
        </Router>
      )
    } else {
      console.log(this.props)

      return (
        <Router>
          <div>
          <a href="https://testing.povertystoplight.org">
          {' '}
          <button className="btn"> Go Back to the Platform </button>{' '}
          </a>
            <Dots />
            {this.props.state.user.token == null ? (
              <div>
                <Route
                  render={props =>
                    props.location.pathname === '/login' ? (
                      ''
                    ) : (
                      <Redirect to="/login" />
                    )
                  }
                />
                <Route exact path="/login" component={Login} />
              </div>
            ) : (
              <div>
                <div className="container-fluid">
                  <div className="row" />
                </div>
                <div className="row">
                  <main
                    role="main"
                    className="col-md-12 ml-sm-12 col-lg-12 px-4 main"
                  >
                    <div>
                      <Switch>
                        <Route exact path="/" component={Dashboard} />
                        <Route exact path="/families" component={Families} />
                        <Route exact path="/family/:id" component={Family} />
                        <Route exact path="/lifemap" component={Lifemap} />
                        <Route exact path="/surveys" component={Surveys} />
                        <Route exact path="/lifemap" component={Lifemap} />
                        <Route render={() => <Redirect to="/" />} />
                      </Switch>
                    </div>
                  </main>
                </div>
              </div>
            )}
          </div>
        </Router>
      )
    }
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
