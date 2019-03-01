import React, { Component } from "react";
import { connect } from "react-redux";
import { Form } from "react-final-form";
import { addSurveyData, modifySurveyStatus } from "../../../../redux/actions";
import { STEPS } from "../../../../constants";
import { withI18n } from "react-i18next";
import SocioEconomicQuestion from "./SocioEconomicQuestion";

import AppNavbar from "../../../../components/AppNavbar";

class SocioEconomicPresentational extends Component {
  state = {
    step: this.props.surveyStatus.socioEconomicStep || 0,
    submitted: false
  };

  goBack = () => {
    if (this.props.index === 0) {
      return this.props.parentPreviousStep;
    } else {
      return this.props.previousStep;
    }
  }

  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.props.draftId)[0];

  getSocioEconomicAnswer = question => {
    let draft = this.getDraft();
    let currentAnswer = draft.economicSurveyDataList.filter(
      answer => answer.key === question.codeName
    )[0]
      ? draft.economicSurveyDataList.filter(
          answer => answer.key === question.codeName
        )[0].value
      : null;
    return currentAnswer;
  };

  initData = questions => {
    // loop through questions and build array from it
    let res = {};
    questions.forEach(question => {
      res[question.codeName] = this.getSocioEconomicAnswer(question);
    });
    return res;
  };

  handleSubmit() {
    this.setState({
      submitted: true
    });
  }

  nextStep = () => {
    const { step } = this.state;
    const {
      index,
      location: {
        state: { surveyId }
      }
    } = this.props;
    this.setState({ step: step + 1 });
    this.props.modifySurveyStatus("socioEconomicStep", step + 1);
    this.props.history.push({
      pathname: `/lifemap/${surveyId}/${STEPS[6].slug}/${index + 1}`,
      state: { surveyId }
    });
  };

  render() {
    const { t } = this.props;
    const questions = this.props.data.sortedQuestions;
    const category = this.props.data.category;
    let initialValues = this.initData(questions);

    if (this.state.submitted) {
      this.nextStep();
    }

    return (
      <div>
        <AppNavbar
          text={category}
          showBack={true}
          backHandler={this.goBack}
        />
        <Form
          onSubmit={(values, form) => {
            Object.keys(values).forEach(key => {
              this.props.addSurveyData(
                this.props.draftId,
                "economicSurveyDataList",
                { [key]: values[key] }
              );
            });

            if (this.props.index === this.props.total - 1) {
              this.props.parentStep();
            } else {
              this.handleSubmit();
            }
          }}
          validate={this.props.validate}
          initialValues={initialValues}
          render={({ handleSubmit, pristine, invalid }) => (
            <form onSubmit={handleSubmit}>
              {questions
                .filter(question => question.forFamilyMember === false)
                .map(question => (
                  <SocioEconomicQuestion
                    key={question.codeName}
                    question={question}
                  />
                ))}
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                >
                  {t("general.continue")}
                </button>
              </div>
            </form>
          )}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  addSurveyData,
  modifySurveyStatus,
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
  )(SocioEconomicPresentational)
);
