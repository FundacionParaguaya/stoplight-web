import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { login } from './../redux/actions'
import logo from './../assets/logo.png'
import './Login.css'
import { prod, demo, test } from './../env.js'

const styles = `
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

#root {
  width: 100%;
}

`
/**
* The Login Component renders the Login Screen and the login logic
* @param {object} state - redux state that contains user information
*
* @extends Component
*/
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: null,
      authed: null,
      err: false
    }
  }

/**
 * Will Select the backend server depending on the prefix before entered username.
 * Username would be entered in the following formats
 ** **t/**username -> test server
 ** **d/**username -> demo server
 ** **p/**username -> production server
 * @param  {string} username username entered by user on frontend.
 * @return {object}          returns the server to be used & the username of the user
 */
  selectServer(username) {
    if (!username) return { server: prod, user: username }
    switch (username.substring(0, 2)) {
      case 'p/':
        return { server: prod, user: username.substring(2) }
      case 'd/':
        return { server: demo, user: username.substring(2) }
      case 't/':
        return { server: test, user: username.substring(2) }
      default:
        return { server: prod, user: username }
    }
  }

/**
 * Handles the submission of the login
 * Gets the server from `selectServer()` based on the username
 * On Success: Calls `loginSuccess()`
 * @return {function} calls loginSuccess if login is sucessful
 */
  handleSubmit() {
    const { server, user } = this.selectServer(this.state.username)
    const url =
      server.oauth +
      `/token?username=${user}&password=${
        this.state.password
      }&grant_type=password`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${server.token}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        const { access_token, user } = responseJson
        this.loginSuccess(access_token, user, server.name)
      })
  }
/**
 * Handles the response from the login request to the backend
 * @param  {string} access_token user's access token from login
 * @param  {object} user         the User object
 * @param  {object} env          The possible environments (backend servers to use)
 * @return {object} this.state             sets the state if login was successful or not. Redirects to dashboard if successful
 */
  loginSuccess(access_token, user, env){
    try {
      this.props.setLogin(user.username, access_token, env)
      this.setState({ authed: user.username })
      return <Redirect to="/dashboard" />
    } catch (e) {
      this.setState({ err: true })
    }
  }
/**
 * Handles the field changes of the login form
 * Updates the state values of the field parameters
 * @param  {string} name field name
 * @param  {object} e    event
 * @return {object} this.state    updates the values of the field parameters accordingly
 */
  onChange(name, e) {
    this.setState({
      [name]: e.target.value,
      err: false
    })
  }

  onKeyPress = e => {
    if (e.which === 13) {
      this.handleSubmit()
    }
  }

  render() {
    let { err } = this.state
    return (
      <div className="form-signin text-center">
        <Helmet>
          <style>{styles}</style>
        </Helmet>
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
        <div>
          <div className={`form-group text-center ${err ? 'has-danger' : ''}`}>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Username"
              required
              autoFocus
              onChange={e => this.onChange('username', e)}
              onKeyPress={this.onKeyPress}
            />
          </div>
          <div className={`form-group text-center ${err ? 'has-danger' : ''}`}>
            <label htmlFor="inputPassword" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="inputPassword"
              className={`form-control ${err ? 'is-invalid' : ''}`}
              placeholder="Password"
              required
              onChange={e => this.onChange('password', e)}
              onKeyPress={this.onKeyPress}
            />
            {err ? (
              <div className="invalid-feedback">
                Wrong credentials. Try again
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <button
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          onClick={e => this.handleSubmit(e)}
        >
          Sign in
        </button>
        <p className="mt-5 mb-3 text-muted">
          Crafted with{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>{' '}
          by Stoplight &copy; 2017 - {new Date().getFullYear()}
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  state: state
})
const mapDispatchToProps = dispatch => ({
  setLogin: (username, token, env) => {
    dispatch(login(username, token, env))
  }
})

export default (Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))
