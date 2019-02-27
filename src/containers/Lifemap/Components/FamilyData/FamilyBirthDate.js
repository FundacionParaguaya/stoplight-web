import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Form } from 'react-final-form'
import { withI18n } from 'react-i18next'

import { addSurveyFamilyMemberData } from '../../../../redux/actions'
import DatePicker from '../../../../components/DatePicker'
import AppNavbar from '../../../../components/AppNavbar'

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
      this.addFamilyBirthDate(moment(date).format('X'), idx + 1)
    }
  }

  getDraft = () =>
    this.props.drafts.filter(draft => draft.draftId === this.props.draftId)[0]

  addFamilyBirthDate = (birthDate, index) => {
    this.props.addSurveyFamilyMemberData({
      id: this.props.draftId,
      index,
      payload: {
        birthDate
      }
    })
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
      console.log(member)
      return (
        <div key={idx} className="form-group">
          <label>{member.firstName}</label>
          <DatePicker
            dateChange={this.dateChange.bind(this, idx)}
            minYear={1900}
            maxYear={moment().format('YYYY')}
            defaultDate={
              member.birthDate
                ? moment(parseInt(member.birthDate) * 1000).format('X')
                : null
            }
          />
        </div>
      )
    })

    return (
      <div>
        <AppNavbar
          text={t('views.birthDates')}
          showBack={true}
          backHandler={this.props.previousStep}
        />
        <Form
          onSubmit={(values, form) => {
            // date update being handled by dateCHange
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
                <p className="form-control" placeholder="" />
              </div>
              {forms}
              <div style={{ paddingTop: 20 }}>
                <button type="submit" className="btn btn-primary btn-block">
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
  )(FamilyBirthDate)
)
