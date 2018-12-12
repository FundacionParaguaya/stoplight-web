import React, { Component } from "react";
import { connect } from "react-redux";
import { loadSurveys } from "../redux/actions";

class Surveys extends Component {
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.loadSurveys();
  };

  render() {
    console.log(this.props.surveys);
    let data = this.props.surveys
      ? this.props.surveys.surveyEconomicQuestions
      : [];
    return (
      <div>
        <ul>
          {data &&
            data.map((question, i) => <li key={i}>{question.questionText}</li>)}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  surveys: state.surveys
});

const mapDispatchToProps = {
  loadSurveys
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Surveys);
