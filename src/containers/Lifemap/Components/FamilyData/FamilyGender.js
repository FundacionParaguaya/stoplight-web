import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'

import { addSurveyFamilyMemberData } from '../../../../redux/actions'
import { STEPS } from '../../../../constants';
import AppNavbar from '../../../../components/AppNavbar'

class FamilyGender extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitte: false,
    }
  }

  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.props.draftId)[0]

  addFamilyMemberGender = (gender, index) => {
    this.props.addSurveyFamilyMemberData({
      id: this.props.draftId,
      index,
      payload: {
        gender
      }
    })
  }

  handleSubmit() {
    this.setState({
      submitted: true
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
          pathname: `/lifemap/${surveyId}/${STEPS[4].slug}`,
          state: {
            surveyId
          }
        }}
      />
    );
  };

  render() {
    const { t } = this.props
    const draft = this.getDraft()

    if (this.state.submitted) {
      return this.nextStep();
    }

    const additionalMembersList = draft.familyData.familyMembersList.filter(
      member => member.firstParticipant === false
    )

    let initialValues = {}
    additionalMembersList.forEach((member, idx) => {
      initialValues[`gender${idx}`] = member.gender || null
    })

    const forms = additionalMembersList.map((member, idx) => {
      return (
        <div key={idx} className="form-group">
          <label>{member.firstName}</label>
          <Field
            name={`gender${idx}`}
            component="select"
            className="custom-select"
          >
            <option value="" disabled>
              {t('views.family.selectGender')}
            </option>
            {this.props.data.gender.map(gender => (
              <option value={gender.value} key={gender.text + gender.value}>
                {gender.text}
              </option>
            ))}
          </Field>
        </div>
      )
    })

    return (
      <div>
        <AppNavbar
          text={t('views.gender')}
          showBack={true}
          backHandler={this.props.previousStep}
        />
        <Form
          onSubmit={(values, form) => {

            Object.keys(values)
              .filter(key => key.includes('gender'))
              .forEach((key, index) => {
                this.addFamilyMemberGender(values[key], index + 1)
              })

            // this.props.nextStep()
            this.handleSubmit();
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
              <div className="form-group">
                <p className="form-control" placeholder="" />
              </div>
              {forms}
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                >
                  {t('general.continue')}
                </button>
              </div>
            </form>
          )}
        />
      </div>
    )
  }
}

const mapDispatchToProps = {
  addSurveyFamilyMemberData
}

const mapStateToProps = ({ surveys, drafts }) => ({
  surveys,
  drafts
})

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyGender)
)
