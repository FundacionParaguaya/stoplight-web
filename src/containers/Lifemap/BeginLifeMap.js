import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export class BeginLifemap extends Component {
  //   numberOfQuestions = this.props.survey.surveyStoplightQuestions.length
  render() {
    // console.log(this.numberOfQuestions)
    return (
      <div style={{ marginTop: 50 }}>
        <p>
          This life map has NUMOFQUESTIONS questions. It will take apporximately
          35 minutes to complete!
        </p>
        <Link to={`/families`}>
          <p>click me</p>
        </Link>
      </div>
    )
  }
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

export default connect(mapStateToProps)(BeginLifemap)
