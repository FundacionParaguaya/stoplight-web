import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { withI18n } from "react-i18next";
import moment from "moment";
import {
  createDraft,
  addSurveyFamilyMemberData
} from "../../../../redux/actions";
import DatePicker from "../../../../components/DatePicker";
import uuid from "uuid/v1";
import countries from "localized-countries";
import { validate } from "./helpers/validationParticipant";
import Error from "../../ErrorComponent";
import family_face_large from "../../../../assets/family_face_large.png";

import AppNavbar from "../../../../components/AppNavbar";

// put this to its own component
const countryList = countries(require("localized-countries/data/en")).array();

class FamilyParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      dateError: 0,
      submitted: false,
      draftId: this.props.draftId || null
    };
  }

  dateChange(date) {
    this.setState({
      date: date,
      dateError: moment(this.state.date).format("X") === "Invalid date" ? -1 : 1
    });
  }

  // TODO: possible error saving drafts
  async createDraft() {
    let surveyId = this.props.surveyId;
    let draftId = uuid();
    await this.props.createDraft({
      surveyId: surveyId,
      created: Date.now(),
      draftId: draftId,
      economicSurveyDataList: [],
      indicatorSurveyDataList: [],
      priorities: [],
      achievements: [],
      familyData: {
        familyMembersList: [
          {
            firstParticipant: true,
            socioEconomicAnswers: []
          }
        ]
      }
    });
    await this.setState({ draftId: draftId });
    await this.props.setDraftId(draftId);
  }
  getDraft = () => {
    return this.props.drafts.filter(
      draft => draft.draftId === this.state.draftId
    )[0];
  };

  addSurveyData = (text, field) => {
    console.log(this.state.draftId);
    this.props.addSurveyFamilyMemberData({
      id: this.state.draftId,
      index: 0,
      payload: {
        [field]: text
      }
    });
  };

  savePrimaryParticipantData = values => {
    values.birthDate = moment(this.state.date).format("X");
    Object.keys(values).forEach(key => {
      this.addSurveyData(values[key], key);
    });
  };

  generateCountriesOptions() {
    const defaultCountry = this.props.data.surveyLocation.country
      ? countryList.filter(
          item => item.code === this.props.data.surveyLocation.country
        )[0]
      : "";

    let countries = countryList.filter(
      country => country.code !== defaultCountry.code
    );
    // Add default country to the beginning of the list
    countries.unshift(defaultCountry);
    // Add prefer not to say answer at the end of the list
    countries.push({ code: "NONE", label: "I prefer not to say" });
    return countries.map(country => {
      return (
        <option key={country.code} value={country.code}>
          {country.label}{" "}
        </option>
      );
    });
  }

  initData(user) {
    let res = {};
    // TODO: fix later
    user = user || {};
    res.firstName = user.firstName || "";
    res.lastName = user.lastName || "";
    res.documentNumber = user.documentNumber || "";
    // up here
    res.gender = user.gender || "";
    res.documentType = user.documentType || "";
    res.birthDate = user.birthDate || null;
    res.birthCountry = user.birthCountry || "";
    res.email = user.email || null;
    res.phoneNumber = user.phoneNumber || null;
    return res;
  }

  nextStep() {
    this.setState({
      submitted: true
    });
  }

  render() {
    // set default country to beginning of list
    const { t, location: { state: { surveyId } } } = this.props;
    const countriesOptions = this.generateCountriesOptions();
    let draft,
      user = {};

    if (this.state.draftId) {
      draft = this.getDraft();
      user = this.initData(draft.familyData.familyMembersList[0]);
      if (this.state.date === null && user.birthDate !== null) {
        this.setState({
          date: new Date(parseInt(user.birthDate * 1000)),
          dateError: 1
        });
      }
    }

    if (this.state.submitted) {
      return (
        <Redirect
          push
          to={{
            pathname: `/lifemap/${surveyId}/2`,
            state: {
              surveyId
            }
          }}
        />
      );
    }

    return (
      <div>
        <AppNavbar
          text={t("views.primaryParticipant")}
          showBack={true}
          backHandler={this.props.parentPreviousStep}
          draftOngoing={this.state.draftId ? true : false}
        />
        <div className="text-center">
          <img src={family_face_large} alt="family_face_large" />
        </div>
        <Form
          onSubmit={values => {
            if (moment(this.state.date).format("X") === "Invalid date") {
              this.setState({ dateError: -1 });
            } else {
              if (!this.state.draftId) {
                this.createDraft()
                  .then(() => {
                    this.savePrimaryParticipantData(values);
                  })
                  .then(() => {
                    this.nextStep();
                  });
              } else {
                this.savePrimaryParticipantData(values);
                this.nextStep();
              }
            }
          }}
          validate={validate}
          initialValues={{
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            documentNumber: user.documentNumber || "",
            gender: user.gender || "",
            documentType: user.documentType || "",
            birthCountry: user.birthCountry || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || ""
          }}
          render={({ handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <Field name="firstName">
                  {({ input, meta }) => {
                    return (
                      <div className="form-group">
                        <label> {t("views.family.firstName")} </label>
                        <input
                          type="text"
                          {...input}
                          className="form-control"
                        />
                        <Error name="firstName" />
                      </div>
                    );
                  }}
                </Field>
              </div>
              <div>
                <Field name="lastName">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label> {t("views.family.lastName")} </label>
                      <input type="text" {...input} className="form-control" />
                      <Error name="lastName" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <div className="form-group">
                  <label> {t("views.family.selectGender")} </label>
                  <Field
                    name="gender"
                    component="select"
                    className="form-control custom-select"
                  >
                    <option value="" disabled />
                    {this.props.data.gender.map(gender => (
                      <option
                        value={gender.value}
                        key={gender.text + gender.value}
                      >
                        {gender.text}
                      </option>
                    ))}
                  </Field>
                  <Error name="gender" />
                </div>
              </div>
              <div className="date-div">
                <label className="form-label date-label m0">
                  {t("views.family.dateOfBirth")}
                </label>
                <DatePicker
                  dateChange={this.dateChange.bind(this)}
                  minYear={1900}
                  maxYear={2019}
                  defaultDate={user.birthDate}
                />
                {this.state.dateError === -1 && (
                  <span className="badge badge-pill badge-danger">
                    Required
                  </span>
                )}
              </div>
              <div>
                <div className="form-group">
                  <label> {t("views.family.documentType")} </label>
                  <Field
                    name="documentType"
                    component="select"
                    className="form-control"
                  >
                    <option value="" disabled />
                    {this.props.data.documentType.map(docType => (
                      <option
                        value={docType.value}
                        key={docType.text + docType.value}
                      >
                        {docType.text}
                      </option>
                    ))}
                  </Field>
                  <Error name="documentType" />
                </div>
              </div>
              <div>
                <Field name="documentNumber">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>{t("views.family.documentNumber")}</label>
                      <input type="text" {...input} className="form-control" />
                      <Error name="documentNumber" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <div className="form-group">
                  <label>{t("views.family.countryOfBirth")}</label>
                  <Field
                    name="birthCountry"
                    component="select"
                    className="form-control"
                  >
                    <option value="" disabled />
                    {countriesOptions}
                  </Field>
                  <Error name="birthCountry" />
                </div>
              </div>
              <div>
                <Field name="email">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>{t("views.family.email")}</label>
                      <input type="text" {...input} className="form-control" />
                      <Error name="email" />
                    </div>
                  )}
                </Field>
              </div>
              <div>
                <Field name="phoneNumber">
                  {({ input, meta }) => (
                    <div className="form-group">
                      <label>{t("views.family.phone")}</label>
                      <input type="text" {...input} className="form-control" />
                      {meta.touched && meta.error && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>

              <div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => {
                    if (!this.state.date) {
                      this.setState({ dateError: -1 });
                    }
                  }}
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
  createDraft,
  addSurveyFamilyMemberData
};

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
});

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyParticipant)
);
