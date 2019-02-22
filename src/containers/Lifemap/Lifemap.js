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
                nextStep={this.nextStep}
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
                nextStep={this.nextStep}
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
        <Route render={() => <h1>Not Found</h1>} />
      </Switch>
    );

    let component = null;
    switch (this.state.step) {
      case 1:
        component = survey && (
          <div className="small-card">
            <TermsPrivacy parentNextStep={this.nextStep} data={survey} />
          </div>
        );
        break;
      case 2:
        // create draft at this point
        // draft should remain in state and is filled with answers from each component
        // might want to createa  function that creates the drafts
        // might want to create a handler for submissions of each step, to add to draft state.
        component = survey && (
          <div className="small-card">
            <FamilyParticipant
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
              data={survey.surveyConfig}
              surveyId={this.props.location.state.surveyId}
              setName={this.setName}
              setDraftId={this.setDraftId}
              draftId={this.state.draftId}
            />
          </div>
        );
        break;
      case 3:
        component = (
          <div className="small-card">
            <FamilyMembers
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
              surveyTakerName={this.state.surveyTakerName}
              jumpStep={this.jumpStep}
              memberCount={this.state.memberCount}
              setMemberCount={this.setMemberCount}
            />
          </div>
        );
        break;
      case 4:
        component = (
          <div className="small-card">
            <FamilyGender
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
              memberCount={this.state.memberCount}
              surveyTaker={this.state.surveyTakerName}
            />
          </div>
        );
        break;
      case 5:
        component = (
          <div className="small-card">
            <FamilyBirthDate
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
              memberCount={this.state.memberCount}
              surveyTaker={this.state.surveyTakerName}
            />
          </div>
        );
        break;
      case 6:
        component = (
          <div className="small-card">
            <FamilyMap
              nextStep={this.nextStep}
              draftId={this.state.draftId}
              data={survey.surveyConfig}
              previousStep={this.previousStep}
              jumpStep={this.jumpStep}
            />
          </div>
        );
        break;
      case 7:
        component = survey && (
          <div className="small-card">
            <SocioEconomic
              parentNextStep={this.nextStep}
              draftId={this.state.draftId}
              parentPreviousStep={this.previousStep}
              data={survey.surveyEconomicQuestions}
            />
          </div>
        );
        break;
      case 8:
        component = (
          <div className="small-card">
            <BeginLifemap
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
              data={survey.surveyStoplightQuestions.length}
            />
          </div>
        );
        break;
      case 9:
        component = survey && (
          <div className="wide-card">
            <StopLight
              draftId={this.state.draftId}
              data={survey.surveyStoplightQuestions}
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
            />
          </div>
        );
        break;
      case 10:
        component = survey && (
          <div className="small-card">
            <IndicatorList
              draftId={this.state.draftId}
              data={survey.surveyStoplightQuestions}
              nextStep={this.nextStep}
              parentPreviousStep={this.previousStep}
              minimumPriorities={survey.minimumPriorities}
            />
          </div>
        );
        break;
      case 11:
        component = survey && (
          <div className="small-card">
            <FinalScreen
              draftId={this.state.draftId}
              data={survey.surveyStoplightQuestions}
              submitDraft={this.submitDraft}
              parentPreviousStep={this.previousStep}
              submitError={this.state.submitError}
            />
          </div>
        );
        break;
      // Create a submit handler to send redux store of graph as graphql mutation once Prorities & Achievements is submitted
      default:
        component = <div class="small-card">NOTHING TO SEE HERE</div>;
    }
    return <div>{component}</div>;
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
