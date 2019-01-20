import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Form } from 'react-final-form'
import { withI18n } from 'react-i18next'

import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'
import DatePicker from '../../../../components/DatePicker'

class FamilyBirthDate extends Component {
  constructor(props) {
    super(props)
    let errorArr = []
    for (let i = 0; i < this.props.memberCount; i++) {
      errorArr.push(0)
    }
    this.state = {
      date: [],
      dateError: errorArr
    }
  }

  dateChange = (idx, date) => {
    if (date) {
      let dateObj = {}
      dateObj[idx] = date
      let dateCopy = this.state.date
      let dateErr = this.state.dateError
      dateErr[idx] = 1
      dateCopy.push(dateObj)
      this.setState({
        date: dateCopy,
        dateError: dateErr
      })
    }
  }

  handleChange = event => {
    this.setState({ memberCount: event.target.value })
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
    const forms = additionalMembersList.map((member, idx) => {
      return (
        <div key={idx}>
          <label>{t('views.family.dateOfBirth')} </label>
          <DatePicker
            dateChange={this.dateChange.bind(this, idx)}
            minYear={1900}
            maxYear={moment().format('YYYY')}
          />
          {this.state.dateError[idx] === -1 && (
            <span className="badge badge-pill badge-danger">Required</span>
          )}
        </div>
      )
    })

    return (
      <div style={{ marginTop: 50 }}>
        <h2> {t('views.birthDates')} </h2>
        <hr />
        <Form
          onSubmit={(values, form) => {
            let newDateError = this.state.dateError
            if (
              this.props.memberCount !== Object.keys(this.state.date).length
            ) {
              if (Object.keys(this.state.date).length === 0) {
                for (let i = 0; i < this.props.memberCount; i++) {
                  newDateError[i] = -1
                }
              } else {
                Object.keys(this.state.date).map(idx => {
                  if (!this.state.date[idx]) {
                    newDateError[idx] = -1
                  }
                })
              }
              this.setState({ dateErr: newDateError })
            } else {
              let familyMembersList = draft.familyData.familyMembersList.filter(
                member => member.firstParticipant === true
              )
              additionalMembersList.forEach((member, idx) => {
                member.birthDate = familyMembersList.push(member)
              })
              this.props.addSurveyDataWhole(this.props.draftId, 'familyData', {
                familyMembersList: familyMembersList
              })
              this.props.nextStep()
            }
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
                    draft.familyData.familyMembersList.filter(
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

export default withI18n()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FamilyBirthDate)
)
