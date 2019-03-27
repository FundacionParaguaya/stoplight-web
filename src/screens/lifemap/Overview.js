import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

export class Overview extends Component {
  handleContinue = () => {}
  render() {
    return (
      <div>
        <h2>Overview</h2>
        <Button variant="contained" fullWidth onClick={this.handleContinue}>
          Continue
        </Button>
      </div>
    )
  }
}

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

export default connect(
  mapStateToProps,
  {}
)(Overview)
