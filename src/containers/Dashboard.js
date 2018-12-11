import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout } from './../redux/actions'

class Dashboard extends Component {
  logout() {
    console.log('logout')
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <button onClick={this.props.logout}>Logout</button>
      </div>
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

export default (Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard))
