import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Terms extends Component {
  render() {
    console.log(this.props.currentSurvey)
    return <div>Terms</div>
  }
}

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Terms)
