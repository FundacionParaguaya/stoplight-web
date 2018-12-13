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
import Surveys from './containers/Surveys'

import logo from './assets/logo_white.png'

import Dots from './components/Dots'

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
              <nav className="navbar navbar-dark bg-primary fixed-top flex-md-nowrap p-0 shadow">
                <Link
                  to="/"
                  className="navbar-brand col-md-3 col-lg-2 mr-0"
                  href="#"
                >
                  <img src={logo} alt="" className="nav-logo" />
                  <span className="brand">Stoplight</span>
                </Link>

                <ul className="navbar-nav px-3">
                  <li className="nav-item text-nowrap">
                    <button
                      className="nav-link btn btn-link"
                      onClick={this.props.logout}
                    >
                      <Power className="feather" /> Sign out
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid">
                <div className="row">
                  <nav className="col-md-3 col-lg-2 d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                      <ul className="nav flex-column">
                        <li className="nav-item">
                          <Link to="/" className="nav-link" href="#">
                            <Home className="feather" />
                            Dashboard
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/families" className="nav-link" href="#">
                            <Users className="feather" />
                            Families
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/surveys" className="nav-link" href="#">
                            <Circle className="feather" />
                            Snapshots
                          </Link>
                        </li>
                        <li className="nav-item nav-btn">
                          <Link
                            className="btn btn-sm btn-success nav-link btn-block"
                            to="/lifemap"
                          >
                            <Plus className="feather" />
                            New Lifemap
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </nav>

                  <main
                    role="main"
                    className="col-md-9 ml-sm-auto col-lg-10 px-4"
                  >
                    <Switch>
                      <Route exact path="/" component={Dashboard} />
                      <Route exact path="/families" component={Families} />
                      <Route exact path="/surveys" component={Surveys} />
                      <Route render={() => <Redirect to="/" />} />
                    </Switch>
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
