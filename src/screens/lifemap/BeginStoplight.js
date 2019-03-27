import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

export class Begin extends Component {
  render() {
    return (
      <div>
        <h2>Begin Lifemap</h2>
        <Button
          variant="contained"
          fullWidth
          onClick={() => this.props.history.push('/lifemap/stoplight/0')}
        >
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
)(Begin)
