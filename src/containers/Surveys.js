import React, { Component } from "react";
import { connect } from "react-redux";
import {
  logout,
  loadSurveys,
  loadFamilies,
  initStep,
  initSurveyStatus,
  saveStep,
  saveDraftId,
  saveSurveyId
} from "./../redux/actions";
import { STEPS } from '../constants';
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
    this.props.initStep();
    this.props.initSurveyStatus("socioEconomicStep");
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
            {surveyStatus.draftId !== null ? (
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
                <div className="card-list">
                  <div className="card-body">
                    <Link
                      to={{
                        pathname: `/lifemap/${survey.id}`,
                        state: {
                          surveyId: survey.id
                        }
                      }}
                      onClick={() => {
                        saveStep(STEPS[0].id);
                        saveDraftId(null);
                      }}
                    >
                      {survey.title}
                    </Link>
                  </div>
                </div>
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
  initSurveyStatus,
  initStep,
  saveStep,
  saveDraftId,
  saveSurveyId,
};

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Surveys)
);
