import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Form } from 'react-final-form'
import { withI18n } from "react-i18next";

import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import DatePicker from '../../../../components/DatePicker'

class FamilyBirthDate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberCount: 0,
      date: {}
    }
  }

  dateChange(date, idx) {
    let dateObj = {}
    dateObj.idx = idx
    dateObj.date = date
    let dateCopy = this.state.date
    dateCopy[idx] = date
    this.setState({
      date: dateCopy
    })
  }

  handleChange = event => {
    this.setState({ memberCount: event.target.value })
  }

  //TODO: handler to skip to map view if only 1 family member!

  render() {
    const { t } = this.props
    const draft = this.props.drafts.filter(
      draft => (draft.id = this.props.draftId)
    )[0]
    const additionalMembersList = draft.family_data.familyMembersList.filter(
      member => member.firstParticipant === false
    )

    const forms = additionalMembersList.map((member, idx) => {
      return (
        <div key={idx}>
            <label>{t('views.family.dateOfBirth')} </label>
            <DatePicker
              dateChange={this.dateChange.bind(this, idx)}
              minYear={1900}
              maxYear={moment().format('YYYY')}
            />
        </div>
      )
    })
    console.log(forms)

    return (
      <div style={{ marginTop: 50 }}>
      <h2> {t('views.birthDates')} </h2>
      <hr />
        <Form
          onSubmit={(values, form) => {
            let familyMembersList = draft.family_data.familyMembersList.filter(
              member => member.firstParticipant === true
            )

            additionalMembersList.forEach((member, idx) => {
              member.birthDate = familyMembersList.push(member)
            })

            this.props.addSurveyDataWhole(
              this.props.draftId,
              'family_data',
              {familyMembersList: familyMembersList}
          )

            this.props.nextStep()
          }}
          initialValues={{}}
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
                  {
                    draft.family_data.familyMembersList.filter(
                      member => member.firstParticipant === true
                    )[0].birthDate
                  }
                </p>
              </div>
              {forms}
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm btn-block"
                >
                  Submit
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

export default withI18n()(connect(
  mapStateToProps,
  mapDispatchToProps
)(FamilyBirthDate))
