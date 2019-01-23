import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Users, Home, Circle, Power, Plus } from 'react-feather'

import { logout } from './redux/actions'
import Login from './containers/Login'
import Dashboard from './containers/Dashboard'
import Families from './containers/Families'
import Family from './containers/Family'
import Surveys from './containers/Surveys'
import Lifemap from './containers/Lifemap'

import logo from './assets/logo_white.png'
import Dots from './components/Dots'

/**
 * This is the Entry Pyont
 * @param {object} state - redux state that contains user information
 */
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Dots />
          {this.props.state.user.username == null ? (
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
            </div>
          )}
        </div>
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  state: state
})
const mapDispatchToProps = dispatch => ({
  logout: () => {
    dispatch(logout())
  }
})

export default (App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
