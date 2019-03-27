import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

export class Final extends Component {
  handleSubmit = () => {
    // submiting to server happens here
    this.props.history.push(`/surveys?sid=${this.props.user.token}&lang=en`)
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

const mapStateToProps = ({ currentdDraft, user }) => ({ currentdDraft, user })

export default connect(
  mapStateToProps,
  {}
)(Final)
