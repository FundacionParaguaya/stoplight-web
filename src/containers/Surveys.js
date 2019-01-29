import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout, loadSurveys, loadFamilies, saveStep, saveDraftId } from './../redux/actions'
import { Link } from 'react-router-dom'
import { withI18n } from 'react-i18next'

import choose_lifemap_image from '../assets/choose_lifemap_image.png'
import Spinner from '../components/Spinner'
import AppNavbar from '../components/AppNavbar'

export class Surveys extends Component {
  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    this.props.loadSurveys()
  }

  render() {
    const { t } = this.props
    return (
      <div>
        <AppNavbar text={t('views.createLifemap')} showBack={false} />
        {this.props.surveyStatus.surveyId ? (<div class="text-center"><Link to={{pathname:`/lifemap`, state:{surveyId: this.props.surveyStatus.surveyId}}} > Click to resume latest Draft </Link></div>): (<div> </div>)}
        <div className="text-center">
          <img src={choose_lifemap_image} alt="choose_lifemap_image" />
        </div>
        {this.props.surveys.length === 0 ? (
          <Spinner />
        ) : (
          this.props.surveys.map((survey, i) => (
            <div key={survey.id} style={{ marginTop: 30 }}>
              <Link
                to={{
                  pathname: `/lifemap`,
                  state: {
                    surveyId: survey.id
                  }
                }}
                onClick={() => {this.props.saveStep(1); this.props.saveDraftId(null); this.props.saveSurveyId(null) }}
              >
                <div className="card-list">
                  <div className="card-body">{survey.title}</div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ surveys, surveyStatus }) => ({
  surveys,
  surveyStatus
})

const mapDispatchToProps = {
  logout,
  loadSurveys,
  loadFamilies,
  saveStep,
  saveDraftId
}

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Surveys)
)
