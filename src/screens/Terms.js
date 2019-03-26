import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

export class Terms extends Component {
  handleContinue = () => {
    this.props.history.push(
      this.props.location.pathname === '/lifemap/terms'
        ? '/lifemap/privacy'
        : '/lifemap/primary-participant'
    )
  }
  render() {
    return (
      <div>
        <h2>Terms</h2>
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
)(Terms)
