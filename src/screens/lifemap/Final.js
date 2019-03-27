import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

export class Final extends Component {
  handleSubmit = () => {
    // submiting to server happens here
    this.props.history.push('/surveys')
  }
  render() {
    return (
      <div>
        <h2>Final</h2>
        <Button variant="contained" fullWidth onClick={this.handleSubmit}>
          Save lifemap
        </Button>
      </div>
    )
  }
}

const mapStateToProps = ({ currentSurvey }) => ({ currentSurvey })

export default connect(
  mapStateToProps,
  {}
)(Final)
