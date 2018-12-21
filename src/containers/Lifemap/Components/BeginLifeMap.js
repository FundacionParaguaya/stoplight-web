import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class BeginLifemap extends Component {
  //   numberOfQuestions = this.props.survey.surveyStoplightQuestions.length
  render() {
    // console.log(this.numberOfQuestions)
    return (
      <div style={{ marginTop: 50 }}>
        <p>
          {`This life map has ${
            this.props.data
          } questions. It will take apporximately
          35 minutes to complete!`}
        </p>
        <div style={{ paddingTop: 20 }}>
          <button
            type="submit"
            className="btn btn-primary btn-sm btn-block"
            onClick={() => this.props.nextStep()}
          >
            Continue
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

export default connect(mapStateToProps)(BeginLifemap)
