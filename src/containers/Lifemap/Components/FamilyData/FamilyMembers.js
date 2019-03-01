import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Field } from "react-final-form";
import { withI18n } from "react-i18next";
import { STEPS } from '../../../../constants';
import ErrorComponent from "../../ErrorComponent";
import {
  addSurveyData,
  addSurveyFamilyMemberData,
  removeFamilyMembers,
  saveStep
} from "../../../../redux/actions";

import AppNavbar from "../../../../components/AppNavbar";
class FamilyMembers extends Component {
  constructor(props) {
    super(props);
    let draft = this.getDraft();
    let memberCount = draft.familyData.countFamilyMembers || "";
    this.state = {
      memberCount: memberCount - 1,
      submitted: false,
    };
  }

  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.props.draftId)[0];

  addFamilyMemberName = (name, index) => {
    this.props.addSurveyFamilyMemberData({
      id: this.props.draftId,
      index,
      payload: {
        firstName: name,
        firstParticipant: false,
        socioEconomicAnswers: []
      }
    });
  };

  handleChange = event => {
    this.setState({ memberCount: event.target.value });
  };

  handleSubmit() {
    this.setState({
      submitted: true
    });
  }

  jumpToMap = () => {
    const {
      location: {
        state: { surveyId }
      }
    } = this.props;
    this.props.saveStep(5);
    this.props.history.push({
      pathname: `/lifemap/${surveyId}/${STEPS[5].slug}`,
      state: {
        surveyId
      }
    });
  };

  //TODO: handler to skip to map view if only 1 family member!
  render() {
    const { t } = this.props;

    let draft = this.getDraft();

    let initialValues = { memberCount: this.state.memberCount };

    draft.familyData.familyMembersList
      .filter(member => member.firstParticipant === false)
      .forEach((member, idx) => {
        initialValues[`membername${idx + 2}`] = member.firstName;
      });

    const forms = [];
    for (let i = 0; i < this.state.memberCount; i++) {
      forms.push(
        <div key={`membernId${i + 2}`}>
          <Field name={`membername${i + 2}`}>
            {({ input, meta }) => (
              <div className="form-group">
                <label>
                  {t("views.family.familyMember")} {i + 2}
                </label>
                <input
                  type="text"
                  {...input}
                  className="form-control"
                  placeholder={t("views.family.name")}
                />
                <ErrorComponent name={`membername${i + 2}`} />
              </div>
            )}
          </Field>
        </div>
      );
    }

    if (this.state.submitted) {
      this.props.parentNextStep();
    }

    return (
      <div>
        <AppNavbar
          text={t("views.familyMembers")}
          showBack={true}
          backHandler={this.props.previousStep}
        />
        <Form
          onSubmit={(values, form) => {
            // need to save familyMembersCount
            let countFamilyMembers = parseInt(values.memberCount) + 1;
            let additionalFamilyMembers = Object.keys(values).filter(key =>
              key.includes("membername")
            );
            //remove family members if fields reduced
            if (
              countFamilyMembers < draft.familyData.familyMembersList.length &&
              this.state.memberCount >= 1
            ) {
              this.props.removeFamilyMembers(
                this.props.draftId,
                countFamilyMembers
              );
              console.log("statecount", this.state.memberCount);
              this.props.setMemberCount(this.state.memberCount);
              this.props.addSurveyData(this.props.draftId, "familyData", {
                countFamilyMembers: countFamilyMembers
              })
              this.handleSubmit();
            } else if (countFamilyMembers <= 1 ) {
              if(draft.familyData.familyMembersList.filter(mbr => !mbr.firstParticipant) > 0){
                console.log('count',countFamilyMembers)
                this.props.removeFamilyMembers(
                  this.props.draftId,
                  countFamilyMembers //should be 1
                )
              }
              this.props.addSurveyData(this.props.draftId, 'familyData', {
                countFamilyMembers: 1
              });
              this.props.setMemberCount(1);
              this.jumpToMap(); // jump to map view
            } else {
              this.props.addSurveyData(this.props.draftId, "familyData", {
                countFamilyMembers: countFamilyMembers
              });

              if (countFamilyMembers < 2) {
              } else {
                // map through values and extract the firstNames of all family members
                additionalFamilyMembers.forEach((key, index) => {
                  this.addFamilyMemberName(values[key], index + 1)
                })
                // combine familyMembers with firstParticipant from primary participant screen
                this.props.setMemberCount(additionalFamilyMembers.length);
                this.handleSubmit();
              }
            }
          }}
          validate={values => {
            const errors = {};
            if (values.memberCount === null) {
              errors.memberCount = "Required";
            }

            for (let i = 0; i < this.state.memberCount; i++) {
              if (!values[`membername${i + 2}`]) {
                errors[`membername${i + 2}`] = "Required";
              }
            }
            return errors;
          }}
          initialValues={initialValues}
          render={({
            handleSubmit,
            submitting,
            pristine,
            values,
            form,
            invalid
          }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <div className="form-group">
                  <label>{t("views.family.peopleLivingInThisHousehold")}</label>
                  <Field name="memberCount">
                    {({ input, meta }) => {
                      const { onChange } = input;
                      const mergedOnChange = e => {
                        this.handleChange(e);
                        onChange(e);
                      };
                      const newInput = { ...input, onChange: mergedOnChange };
                      return (
                        <select {...newInput} className="custom-select">
                          <option value="" disabled />
                          <option value="0">1</option>
                          <option value="1">2</option>
                          <option value="2">3</option>
                          <option value="3">4</option>
                          <option value="4">5</option>
                          <option value="5">6</option>
                          <option value="6">7</option>
                          <option value="7">8</option>
                          <option value="8">9</option>
                          <option value="9">10</option>
                        </select>
                      );
                    }}
                  </Field>
                  <ErrorComponent name="memberCount" />
                </div>
              </div>
              <div className="form-group">
                <label>{t("views.primaryParticipant")}</label>
                <p className="form-control" placeholder="">
                  {draft.familyData.familyMembersList[0].firstName}
                </p>
              </div>
              {forms}
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
  addSurveyFamilyMemberData,
  removeFamilyMembers,
  saveStep
};

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
});

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyMembers)
);
