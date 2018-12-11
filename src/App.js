import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Login from './containers/Login'
import Dashboard from './containers/Dashboard'
import Family from './containers/Family'


let App = props => {
  console.log(props.state.user.username)
  return (
  <div className="App">
    <Switch>


      <PrivateRoute
        authed={props.state.user.username}
        exact
        path="/"
        component={Dashboard}
      />
      <Route exact path="/login/" component={Login} />
      <Route exact path="/families/" component={Family} />
    </Switch>
  </div>
)}

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login/', state: { from: props.location } }}
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
