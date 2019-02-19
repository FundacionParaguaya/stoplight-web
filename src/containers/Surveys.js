import React, { Component } from "react";
import { connect } from "react-redux";
import {
  logout,
  loadSurveys,
  loadFamilies,
  saveStep,
  saveDraftId,
  saveSurveyId
} from "./../redux/actions";
import { Link } from "react-router-dom";
import { withI18n } from "react-i18next";

import choose_lifemap_image from "../assets/choose_lifemap_image.png";
import Spinner from "../components/Spinner";
import AppNavbar from "../components/AppNavbar";

export class Surveys extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.loadSurveys();
  };

  render() {
    const { t, surveyStatus, surveys, saveStep, saveDraftId } = this.props;
    return (
      <div className="small-card">
        <AppNavbar
          text={t("views.createLifemap")}
          showBack={false}
          draftOngoing={surveyStatus.draftId !== null ? true : false}
        />
        <div className="text-center">
          <img src={choose_lifemap_image} alt="choose_lifemap_image" />
        </div>
        {surveys.length === 0 ? (
          <Spinner />
        ) : (
          <div>
            {surveyStatus.surveyId !== null ? (
              <div className="card-list">
                <div className="card-body">
                  <Link
                    to={{
                      pathname: `/lifemap`,
                      state: { surveyId: surveyStatus.surveyId }
                    }}
                  >
                    {" "}
                    Click to resume latest Draft{" "}
                  </Link>
                </div>
              </div>
            ) : (
              <div> </div>
            )}
            {surveys.map(survey => (
              <div key={survey.id} style={{ marginTop: 30 }}>
                <Link
                  to={{
                    pathname: `/lifemap`,
                    state: {
                      surveyId: survey.id
                    }
                  }}
                  onClick={() => {
                    // saveStep(1);
                    saveDraftId(null);
                  }}
                >
                  <div className="card-list">
                    <div className="card-body">{survey.title}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ surveys, surveyStatus }) => ({
  surveys,
  surveyStatus
});

const mapDispatchToProps = {
  logout,
  loadSurveys,
  loadFamilies,
  saveStep,
  saveDraftId,
  saveSurveyId
};

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Surveys)
);
