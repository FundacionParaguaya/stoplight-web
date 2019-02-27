import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import {
  loadSurveys,
  submitDraft,
  saveStep,
  saveDraftId,
  saveSurveyId,
  saveSurveyStatus
} from "../../redux/actions";
import BeginLifemap from "./Components/BeginLifeMap";
import FamilyParticipant from "./Components/FamilyData/FamilyParticipant";
import FamilyMembers from "./Components/FamilyData/FamilyMembers";
import FamilyGender from "./Components/FamilyData/FamilyGender";
import FamilyBirthDate from "./Components/FamilyData/FamilyBirthDate";
import FamilyMap from "./Components/FamilyData/FamilyMap";
import FinalScreen from "./Components/FinalScreen";
import IndicatorList from "./Components/PrioritiesAchievements/IndicatorList";
import SocioEconomic from "./Components/SocioEconomic";
import StopLight from "./Components/StopLight";
import TermsPrivacy from "./Components/TermsPrivacy";

// TODO: place survey taker name + draftid in redux
// TODO: moving back one parent step will place you on the first step of the parent

class Lifemap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: this.props.surveyStatus.step || 1,
      draftId: this.props.surveyStatus.draftId || null,
      surveyTakerName: "",
      memberCount: 0,
      draft: null,
      submitError: false
    };
    this.props.saveSurveyStatus("not sent");
  }

  // Setup the `beforeunload` event listener
  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", ev => {
      ev.preventDefault();
      return (ev.returnValue = "Are you sure you want to close?");
    });
  };

  componentDidMount() {
    this.loadData();
    // this.setupBeforeUnloadListener()
  }

  setMemberCount = num => {
    this.setState({ memberCount: num });
    console.log("num", num);
    console.log(this.state.memberCount);
  };

  setDraftId = id => {
    this.props.saveDraftId(id);
    this.setState({ draftId: id });
  };

  loadData = () => {
    this.props.loadSurveys();
  };

  submitDraft = () => {
    let draft = this.props.drafts.filter(
      draft => draft.draftId === this.state.draftId
    )[0];
    this.props.submitDraft(draft);
  };

  nextStep = () => {
    const { step } = this.state;
    this.props.saveStep(step + 1);
    this.setState({ step: step + 1 });
  };

  previousStep = () => {
    const { step } = this.state;
    this.props.saveStep(step - 1);
    this.setState({ step: step - 1 });
  };

  jumpStep = additionalSteps => {
    const { step } = this.state;
    this.setState({ step: step + additionalSteps });
  };

  setName = name => {
    this.setState({ surveyTakerName: name });
  };

  render() {
    const { match } = this.props;

    let survey;
    if (!this.props.location || !this.props.location.state) {
      this.props.history.push("/surveys");
    }

    if (this.props.surveyStatus.status === "success") {
      this.props.saveSurveyId(null);
      this.props.saveStep(null);
      this.setState({ draftId: null, draftIsOngoing: false });
      window.location.href = "https://testing.povertystoplight.org";
    } else if (
      this.props.surveyStatus.status === "fail" &&
      this.state.submitError === false
    ) {
      this.setState({ submitError: true });
      console.log(this.props.surveyStatus.error);
    }

    if (
      match.params.surveyId &&
      parseInt(match.params.surveyId) !== this.props.surveyStatus.surveyId
    ) {
      if (this.props.surveys) {
        survey = this.props.surveys.filter(
          survey => survey.id === parseInt(match.params.surveyId)
        )[0];
      }
      // this.props.saveSurveyId(match.params.surveyId)
    } else if (this.props.surveyStatus.surveyId) {
      survey = this.props.surveys.filter(
        survey => survey.id === this.props.surveyStatus.surveyId
      )[0];
    } else {
      this.props.history.push(`/surveys`);
    }

    return (
      <Switch>
        <Route
          exact
          path={match.url}
          render={() => (
            <Redirect
              push
              to={{
                pathname: `${match.url}/terms`,
                state: {
                  surveyId: match.params.surveyId
                }
              }}
            />
          )}
        />
        <Route
          exact
          path={`${match.url}/terms`}
          render={props => (
            <div className="small-card">
              <TermsPrivacy
                {...props}
                parentNextStep={this.nextStep}
                data={survey}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/1`}
          render={props => (
            <div className="small-card">
              <FamilyParticipant
                {...props}
                parentPreviousStep={this.previousStep}
                data={survey.surveyConfig}
                surveyId={match.params.surveyId}
                setName={this.setName}
                setDraftId={this.setDraftId}
                draftId={this.state.draftId}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/2`}
          render={props => (
            <div className="small-card">
              <FamilyMembers
                {...props}
                draftId={this.state.draftId}
                data={survey.surveyConfig}
                previousStep={this.previousStep}
                surveyTakerName={this.state.surveyTakerName}
                jumpStep={this.jumpStep}
                memberCount={this.state.memberCount}
                setMemberCount={this.setMemberCount}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/3`}
          render={props => (
            <div className="small-card">
              <FamilyGender
                {...props}
                draftId={this.state.draftId}
                data={survey.surveyConfig}
                previousStep={this.previousStep}
                memberCount={this.state.memberCount}
                surveyTaker={this.state.surveyTakerName}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/4`}
          render={props => (
            <div className="small-card">
              <FamilyBirthDate
                {...props}
                draftId={this.state.draftId}
                data={survey.surveyConfig}
                previousStep={this.previousStep}
                memberCount={this.state.memberCount}
                surveyTaker={this.state.surveyTakerName}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/5`}
          render={props => (
            <div className="small-card">
              <FamilyMap
                {...props}
                draftId={this.state.draftId}
                data={survey.surveyConfig}
                previousStep={this.previousStep}
                jumpStep={this.jumpStep}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/6`}
          render={props => (
            <div className="small-card">
              <SocioEconomic
                {...props}
                // parentNextStep={this.nextStep}
                draftId={this.state.draftId}
                parentPreviousStep={this.previousStep}
                data={survey.surveyEconomicQuestions}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/7`}
          render={props => (
            <div className="small-card">
              <BeginLifemap
                {...props}
                parentPreviousStep={this.previousStep}
                data={survey.surveyStoplightQuestions.length}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/8`}
          render={props => (
            <div className="wide-card">
              <StopLight
                {...props}
                draftId={this.state.draftId}
                data={survey.surveyStoplightQuestions}
                parentPreviousStep={this.previousStep}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/9`}
          render={props => (
            <div className="small-card">
              <IndicatorList
                {...props}
                draftId={this.state.draftId}
                data={survey.surveyStoplightQuestions}
                nextStep={this.nextStep}
                parentPreviousStep={this.previousStep}
                minimumPriorities={survey.minimumPriorities}
              />
            </div>
          )}
        />
        <Route
          path={`${match.url}/10`}
          render={props => (
            <div className="small-card">
              <FinalScreen
                {...props}
                draftId={this.state.draftId}
                data={survey.surveyStoplightQuestions}
                submitDraft={this.submitDraft}
                parentPreviousStep={this.previousStep}
                submitError={this.state.submitError}
              />
            </div>
          )}
        />
        <Route render={() => <h1>Not Found</h1>} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  state: state,
  surveys: state.surveys,
  drafts: state.drafts,
  surveyStatus: state.surveyStatus
});
const mapDispatchToProps = {
  loadSurveys,
  submitDraft,
  saveStep,
  saveDraftId,
  saveSurveyId,
  saveSurveyStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lifemap);
