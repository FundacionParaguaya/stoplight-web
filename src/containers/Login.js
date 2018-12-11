import React, { Component } from 'react'
import { connect } from 'react-redux'
import { login, loadFamilies } from './../redux/actions'
import logo from './../assets/logo.png'
import './Login.css'
import platform from './../env.js'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      password: null
    }
  }
  componentDidMount(){
    this.loadData()
  }

  loadData=()=>{
    this.props.loadFamilies()
  }

  handleSubmit() {
    // const url =
    //   platform.oauth +
    //   `/token?username=${this.state.username}&password=${
    //     this.state.password
    //   }&grant_type=password`

    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8',
    //     Authorization: 'Basic YmFyQ2xpZW50SWRQYXNzd29yZDpzZWNyZXQ='
    //   }
    // })
    //   .then(response => response.json())
    //   .then(responseJson => {
    //     this.saveToLocalStorage(responseJson)
    //   })
  }

  saveToLocalStorage = data => {
    const { access_token, user } = data
    console.log(access_token, user.username)
    this.props.setLogin(user.username, access_token)
    // localStorage.setItem('user', JSON.stringify(user))
    // localStorage.setItem('access_token', access_token)
    // session.save({ access_token, user })
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
    console.log(this.props.families)
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
  // stateObject: state,
  families:state.families
})
// const mapDispatchToProps = dispatch => ({
//   setLogin: (username, token) => {
//     dispatch(login(username, token))
//   }
// })

const mapDispatchToProps = {
  loadFamilies
}


export default connect(
  mapStateToProps,
   mapDispatchToProps
)(Login)
