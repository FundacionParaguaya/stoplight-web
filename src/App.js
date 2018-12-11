import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Login from './containers/Login'
import Dashboard from './containers/Dashboard'

let App = props => (
  <Router>
    <div>
      <Route path="/login" component={Login} />
      <PrivateRoute
        path="/dashboard"
        authed={
          props.state.user.username != null && props.state.user.username !== ''
        }
        component={Dashboard}
      />
    </div>
  </Router>
)

function PrivateRoute({ component: Component, authed, ...rest }) {
  console.log(authed)
  return (
    <Route
      {...rest}
      render={props =>
        authed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

const mapStateToProps = state => ({
  state: state
})

export default (App = connect(mapStateToProps)(App))
