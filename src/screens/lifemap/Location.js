import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateDraft } from '../../redux/actions'
import Button from '@material-ui/core/Button'

export class Location extends Component {
  handleContinue = () => {
    console.log(this.props.currentSurvey)
    // validation happens here
    this.props.history.push('/lifemap/economics/0')
  }

  componentDidMount() {
    // get user location happens here
  }

  render() {
    return (
      <div>
        <h2>Location</h2>
        <Button variant="contained" fullWidth onClick={this.handleContinue}>
          Continue
        </Button>
      </div>
    )
  }
}

const mapStateToProps = ({ currentSurvey, currentDraft }) => ({
  currentSurvey,
  currentDraft
})

const mapDispatchToProps = { updateDraft }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location)
