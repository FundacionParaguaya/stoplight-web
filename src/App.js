import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Login from './containers/Login'
import Dashboard from './containers/Dashboard'

let App = props => (
  <div className="App">
    <Switch>
      <PrivateRoute
        authed={props.username}
        exact
        path="/"
        component={Dashboard}
      />
      <Route path="/login" component={Login} />
    </Switch>
  </div>
)

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
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
