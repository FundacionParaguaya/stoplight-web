import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
  Switch
} from 'react-router-dom'
import { connect } from 'react-redux'

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
                  className="navbar-brand col-sm-3 col-md-2 mr-0"
                  href="#"
                >
                  <img src={logo} alt="" className="nav-logo" />
                  Stoplight
                </Link>

                <ul className="navbar-nav px-3">
                  <li className="nav-item text-nowrap">
                    <button
                      className="nav-link btn btn-link"
                      onClick={this.props.logout}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid">
                <div className="row">
                  <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                      <ul className="nav flex-column">
                        <li className="nav-item">
                          <Link to="/" className="nav-link" href="#">
                            <span data-feather="home" />
                            Dashboard
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/families" className="nav-link" href="#">
                            <span data-feather="file" />
                            Families
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link to="/surveys" className="nav-link" href="#">
                            <span data-feather="shopping-cart" />
                            Snapshots
                          </Link>
                        </li>
                        <li className="nav-item nav-btn">
                          <Link
                            className="btn btn-sm btn-success nav-link btn-block"
                            to="/lifemap"
                          >
                            <span data-feather="users" />
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
