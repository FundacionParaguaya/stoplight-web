import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { withI18n } from "react-i18next";
import { addSurveyData, modifySurveyStatus } from "../../../../redux/actions";
import StopLightPresentational from "./StopLightPresentational";
import AppNavbar from "../../../../components/AppNavbar";

class StopLight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: this.props.surveyStatus.stoplightIndicatorStep,
      renderSkippedQuestionsScreen: false,
      skippedQuestionsList: [],
      imagesLoaded: 0
    };
  }

  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.props.draftId)[0];

  nextStep = (value, codeName) => {
    this.setState({ imagesLoaded: 0 });

    const { step } = this.state;

    let answer = {};
    answer[codeName] = value.value || 0;
    if (answer[codeName] === 0) {
      this.setState(prevState => ({
        skippedQuestionsList: [
          ...prevState.skippedQuestionsList,
          this.props.data[this.state.step]
        ]
      }));
    }
    this.props.addSurveyData(
      this.props.draftId,
      "indicatorSurveyDataList",
      answer
    );

    // check if the step is > the number of questions
    if (this.state.step === this.props.data.length - 1) {
      // true if on the last question e.g. 54/54
      // render Skipped Questions - to be implemented
      if (this.state.skippedAQuestion) {
        // skippedAQuestion is a flag that is true if the user has skipped a question
        this.setState({ renderSkippedQuestionsScreen: true }); // todo, not working at the moment
      } else {
        this.props.nextStep();
      }
    } else if (this.state.step > this.props.data.length - 1) {
      this.props.nextStep();
    } else {
      this.setState({ step: step + 1 });
      this.props.modifySurveyStatus("stoplightIndicatorStep", step + 1);
    }
  };

  previousStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1, imagesLoaded: 0 });
    this.props.modifySurveyStatus("stoplightIndicatorStep", step - 1);
  };

  updateImageStatus = () => {
    this.setState({ imagesLoaded: this.state.imagesLoaded + 1 });
  };

  getCheckedIndicator = () => {
    let draft = this.getDraft();
    let checkedAnswer = draft.indicatorSurveyDataList.filter(
      indicator => indicator.key === this.props.data[this.state.step].codeName
    )[0]
      ? draft.indicatorSurveyDataList.filter(
          indicator =>
            indicator.key === this.props.data[this.state.step].codeName
        )[0].value
      : null;
    console.log(checkedAnswer);
    return checkedAnswer || null;
  };

  goBack = () => {
    if (this.state.step <= 0) {
      this.props.parentPreviousStep();
    } else {
      this.previousStep();
    }
  };

  render() {
    const { t, match } = this.props;
    this.getCheckedIndicator();
    let stopLightQuestions = this.props.data;
    return (
      <>
        <Route
          exact
          path={match.url}
          render={() => (
            <Redirect
              push
              to={{
                pathname: `${match.url}/${this.state.step}`,
                state: {
                  surveyId: match.params.surveyId
                }
              }}
            />
          )}
        />
        <Route
          exact
          path={`${match.url}/:step`}
          render={props => (
            <div>
              <AppNavbar
                text={t("views.yourLifeMap")}
                showBack
                backHandler={() => this.goBack()}
              />
              <StopLightPresentational
                {...props}
                data={stopLightQuestions[this.state.step]}
                index={this.state.step}
                total={stopLightQuestions.length - 1}
                nextStep={this.nextStep}
                previousStep={this.previousStep}
                parentPreviousStep={this.props.parentPreviousStep}
                imagesLoaded={this.state.imagesLoaded}
                updateImageStatus={this.updateImageStatus}
                checkedAnswer={this.getCheckedIndicator()}
              />
            </div>
          )}
        />
      </>
    );
  }
}

const mapDispatchToProps = {
  addSurveyData,
  modifySurveyStatus
};

const mapStateToProps = ({ surveys, drafts, surveyStatus }) => ({
  surveys,
  drafts,
  surveyStatus
});

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StopLight)
);
