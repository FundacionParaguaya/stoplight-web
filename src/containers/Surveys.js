import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout, loadSurveys, loadFamilies } from './../redux/actions'
import { Link } from 'react-router-dom'
export class Surveys extends Component {
  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    this.props.loadSurveys()
  }

  render() {
    console.log(this.props.surveys)
    return (
      <div style={{ marginTop: 50 }} >
      <h2> Surveys </h2>
      <hr />
        {this.props.surveys.map((survey, i) => (
          <div key={survey.id} style={{ marginTop: 30 }}>
            <Link
              to={{
                pathname: `/lifemap`,
                state: {
                  surveyId: survey.id
                }
              }}
            >
              <div className="card" style={{ marginTop: 50 }}>
                <div className="card-body">{survey.title}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

const mapDispatchToProps = {
  logout,
  loadSurveys,
  loadFamilies
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Surveys)
