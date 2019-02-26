import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import SocioEconomicPresentational from "./SocioEconomicPresentational";

class SocioEconomic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      surveyEconomicQuestions: this.formatQuestions(this.props.data),
      answers: [],
      completed: false,
    };
  }

  formatQuestions = questions => {
    let categories = {};
    let res = [];
    questions.forEach(question => {
      if (question.required === true) {
        // add '*' to appear beside required question texts
        // but remove first if it already exists
        question.questionText = question.questionText.split(" *")[0];
        question.questionText += " *";
      }
      if (!categories.hasOwnProperty(question.topic)) {
        categories[question.topic] = [];
        categories[question.topic].push(question);
      } else {
        categories[question.topic].push(question);
      }
    });
    for (var key in categories) {
      res.push({ category: key, sortedQuestions: categories[key] });
    }
    return res;
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  previousStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };

  setComplete = () => {
    this.setState({
      completed: true
    });
  }

  nextStep = () => {
    const {
      location: {
        state: { surveyId }
      }
    } = this.props;
    return (
      <Redirect
        push
        to={{
          pathname: `/lifemap/${surveyId}/7`,
          state: {
            surveyId
          }
        }}
      />
    );
  };

  render() {
    return this.state.surveyEconomicQuestions.map(
      (question, idx, questions) => {
        const splicedSurveyQuestions =
          questions && questions.filter((category, index) => index === idx);

        const requiredQuestions = splicedSurveyQuestions.map(data =>
          data.sortedQuestions.filter(question => question.required)
        );

        let requiredCodeNames = requiredQuestions[0].map(
          question => question.codeName
        );

        const validate = values => {
          const errors = {};
          requiredCodeNames.forEach(codeName => {
            if (!values[codeName]) {
              errors[codeName] = "Required";
            }
          });
          return errors;
        };

        if (this.state.completed) {
          return this.nextStep();
        }

        return (
          <Route
            path={`${this.props.match.url}/${idx}`}
            render={props => (
              <div>
                <SocioEconomicPresentational
                  {...props}
                  draftId={this.props.draftId}
                  data={splicedSurveyQuestions[0]}
                  index={idx}
                  total={this.state.surveyEconomicQuestions.length}
                  nextStep={this.nextStep}
                  previousStep={this.previousStep}
                  parentPreviousStep={this.props.parentPreviousStep}
                  parentStep={this.setComplete}
                  requiredQuestions={requiredQuestions}
                  validate={validate}
                />
              </div>
            )}
          />
        );
      }
    );
  }
}

const mapDispatchToProps = {};

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocioEconomic);
