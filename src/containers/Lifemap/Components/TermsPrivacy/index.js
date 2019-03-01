import React, { Component } from "react";
import { connect } from "react-redux";
import { withI18n } from "react-i18next";
import { saveStep } from "../../../../redux/actions";
import { STEPS } from "../../../../constants";
import TermsPrivacyPresentational from "./TermsPrivacyPresentational";

class TermsPrivacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      header: "",
      body: null,
      termsAccepted: false,
      privacyAccepted: false,
      action: null
    };
  }

  viewData = () => {
    const {
      t,
      data: { termsConditions }
    } = this.props;
    return {
      header: t("views.termsConditions"),
      body: termsConditions
    };
  };

  componentDidMount() {
    this.setState({
      ...this.state,
      ...this.viewData()
    });
  }

  nextStep = () => {
    const {
      t,
      data: { privacyPolicy }
    } = this.props;
    this.setState(prevState => {
      if (prevState.step === 0) {
        return {
          ...prevState,
          step: prevState.step + 1,
          termsAccepted: true,
          header: t("views.privacyPolicy"),
          body: privacyPolicy,
          action: "next"
        };
      } else {
        return {
          ...prevState,
          privacyAccepted: true
        };
      }
    });
  };

  previousStep = () => {
    const {
      t,
      data: { termsConditions }
    } = this.props;
    const { step } = this.state;
    if (step === 0) {
      this.props.history.push("/surveys");
    }
    this.setState({
      step: step - 1,
      action: "back",
      termsAccepted: false,
      header: t("views.termsConditions"),
      body: termsConditions
    });
  };

  render() {
    const { privacyAccepted } = this.state;

    if (privacyAccepted) {
      this.props.parentNextStep();
    }

    return (
      this.state.body && (
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
    );
  }
}

const mapDispatchToProps = { saveStep };

export default withI18n()(
  connect(
    null,
    mapDispatchToProps
  )(TermsPrivacy)
);
