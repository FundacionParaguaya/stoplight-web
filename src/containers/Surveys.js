import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logout, loadSurveys, loadFamilies, saveStep, saveDraftId } from './../redux/actions'
import { Link } from 'react-router-dom'
import { withI18n } from 'react-i18next'
import choose_lifemap_image from '../assets/choose_lifemap_image.png'
import Spinner from '../components/Spinner'
export class Surveys extends Component {
  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    this.props.loadSurveys()
  }

  render() {
    console.log(this.props.surveys)
    const { t } = this.props
    return (
      <div style={{ marginTop: 50 }}>
        <h2>{t('views.createLifemap')}</h2>
        <hr />
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
                onClick={() => {this.props.saveStep(1); this.props.saveDraftId(null)} }
              >
                <div className="card" style={{ marginTop: 50 }}>
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

const mapStateToProps = ({ surveys }) => ({
  surveys
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
