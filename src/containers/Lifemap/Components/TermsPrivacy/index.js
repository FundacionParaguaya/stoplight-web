import React, { Component } from "react";
import { connect } from "react-redux";
import { withI18n } from "react-i18next";
import TermsPrivacyPresentational from "./TermsPrivacyPresentational";

class TermsPrivacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      header: "",
      body: null
    };
  }

  firstView = () => {
    const {
      t,
      data: { termsConditions }
    } = this.props;
    return {
      header: t("views.termsConditions"),
      body: termsConditions
    }
  }

  componentDidMount() {
    this.setState({
      header: this.firstView().header,
      body: this.firstView().body,
    });
  }

  nextStep = () => {
    const {
      t,
      data: { privacyPolicy }
    } = this.props;
    const { step } = this.state;
    this.setState({
      step: step + 1,
      header: t("views.privacyPolicy"),
      body: privacyPolicy
    });
  };

  previousStep = () => {
    const { step } = this.state;
    if (step === 0) {
      this.props.history.push("/surveys");
    }
    this.setState({
      step: step - 1,
      header: this.firstView().header,
      body: this.firstView().body,
    });
  };

  render() {
    return this.state.body && (
      <div>
        <TermsPrivacyPresentational
          data={this.state.body}
          header={this.state.header}
          step={this.state.step}
          nextStep={this.nextStep}
          previousStep={this.previousStep}
        />
      </div>
    )
  }
}

export default withI18n()(
  connect(
    null,
    {}
  )(TermsPrivacy)
);
