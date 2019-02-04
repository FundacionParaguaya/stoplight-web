import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { withI18n } from 'react-i18next'

import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import AppNavbar from '../../../../components/AppNavbar'

class FamilyGender extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  //TODO: handler to skip to map view if only 1 family member!

  render() {
    const { t } = this.props
    const draft = this.props.drafts.filter(
      draft => draft.draftId === this.props.draftId
    )[0]
    const additionalMembersList = draft.familyData.familyMembersList.filter(
      member => member.firstParticipant === false
    )

    let initialValues ={}
    additionalMembersList.forEach((member,idx) => {
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
            let familyMembersList = draft.familyData.familyMembersList.filter(
              member => member.firstParticipant === true
            )
            additionalMembersList.forEach((member, idx) => {
              member.gender = values[`gender${idx}`]
              familyMembersList.push(member)
            })

            this.props.addSurveyDataWhole(this.props.draftId, 'familyData', {
              familyMembersList: familyMembersList
            })

            this.props.nextStep()
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
                <p className="form-control" placeholder="">
                </p>
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
  addSurveyData,
  addSurveyDataWhole
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
