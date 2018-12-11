import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { login } from './../redux/actions'
import logo from './../assets/logo.png'
import './Login.css'
import platform from './../env.js'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: null,
      authed: null
    }
  }

  handleSubmit() {
    const url =
      platform.oauth +
      `/token?username=${this.state.username}&password=${
        this.state.password
      }&grant_type=password`

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Basic YmFyQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ='
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        const { access_token, user } = responseJson
        this.loginSuccess(access_token, user)
      })
  }

  loginSuccess = (access_token, user) => {
    this.props.setLogin(user.username, access_token)
    this.setState({ authed: user.username })
    return <Redirect to="/dashboard" />
  }

  onChange(name, e) {
    this.setState({
      [name]: e.target.value
    })
  }

  onKeyPress = e => {
    if (e.which === 13) {
      this.handleSubmit()
    }
  }

  render() {
    if (this.state.authed != null || this.props.state.user.username != null)
      return <Redirect to="/dashboard" />
    return (
      <div className="form-signin text-center">
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
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
        <label htmlFor="inputPassword" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Password"
          required
          onChange={e => this.onChange('password', e)}
          onKeyPress={this.onKeyPress}
        />
        <button
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          onClick={e => this.handleSubmit(e)}
        >
          Sign in
        </button>
        <p className="mt-5 mb-3 text-muted">
          Povered by Stoplight &copy; 2017 - {new Date().getFullYear()}
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  state: state
})
const mapDispatchToProps = dispatch => ({
  setLogin: (username, token) => {
    dispatch(login(username, token))
  }
})
export default (Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))
