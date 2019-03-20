import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { updateUser } from '../redux/actions'

export class Surveys extends Component {
  componentDidMount() {
    const { location, updateUser } = this.props

    console.log(document.referrer.split('.').length > 1)

    // check for user token from the location params
    if (location.search) {
      updateUser({
        username: 'cannot get user name at this stage',
        token: this.props.location.search.match(/sid=(.*)&/)[1] || null,
        env:
          document.referrer.split('.').length > 1
            ? document.referrer.split('.')[0].split('//')[1]
            : 'testing'
      })
    }
  }
  render() {
    return <h1>Surveys</h1>
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = { updateUser }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Surveys)
