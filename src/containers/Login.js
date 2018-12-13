import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { login } from './../redux/actions'
import logo from './../assets/logo.png'
import './Login.css'
import platform from './../env.js'

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

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: null,
      authed: null,
      formErr: false
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
        Authorization: `Basic ${platform.token}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        const { access_token, user } = responseJson
        this.loginSuccess(access_token, user)
      })
  }

  loginSuccess = (access_token, user) => {
    try {
      this.props.setLogin(user.username, access_token)
      this.setState({ authed: user.username })
      return <Redirect to="/dashboard" />
    } catch (e) {
      this.setState({ formErr: true })
    }
  }

  onChange(name, e) {
    this.setState({
      [name]: e.target.value,
      formErr: false
    })
  }

  onKeyPress = e => {
    if (e.which === 13) {
      this.handleSubmit()
    }
  }

  render() {
    return (
      <div className="form-signin text-center">
        <Helmet>
          <style>{styles}</style>
        </Helmet>
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

        {this.state.formErr ? (
          <div>
            <div className="form-group has-danger">
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
            <div className="form-group has-danger">
              <label htmlFor="inputPassword" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="inputPassword"
                className="form-control is-invalid"
                placeholder="Password"
                required
                onChange={e => this.onChange('password', e)}
                onKeyPress={this.onKeyPress}
              />
              <div className="invalid-feedback">
                Wrong credentials. Try again
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group text-center">
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
            <div className="form-group text-center">
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
            </div>
          </div>
        )}
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
