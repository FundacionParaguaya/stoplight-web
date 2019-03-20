import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Terms extends Component {
  render() {
    return <div>Primary Participant</div>
  }
}

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Terms)
