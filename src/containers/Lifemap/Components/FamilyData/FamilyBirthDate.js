import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Form } from 'react-final-form'
import { withI18n } from 'react-i18next'

import { addSurveyData } from '../../../../redux/actions'
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
      let dateObj = {}
      dateObj[idx] = date
      let dateCopy = this.state.date
      let dateErr = this.state.dateError
      dateErr[idx] = 1
      dateCopy.push(dateObj)
      this.setState({
        date: dateCopy,
      })
    }
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
    console.log(additionalMembersList)

    const forms = additionalMembersList.map((member, idx) => {
      console.log(member)
      return (
        <div key={idx} className="form-group">
          <label>{member.firstName}</label>
          <DatePicker
            dateChange={this.dateChange.bind(this, idx)}
            minYear={1900}
            maxYear={moment().format('YYYY')}
            defaultDate={member.birthDate ? moment(parseInt(member.birthDate)*1000).format('X') : null}
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
              let familyMembersList = draft.familyData.familyMembersList.filter(
                member => member.firstParticipant === true
              )
              additionalMembersList.forEach((member, idx) => {
                let date = this.state.date[idx]  ? this.state.date[idx][idx] : null
                member.birthDate = date ? moment(date).format('X') : null
                familyMembersList.push(member)
              })
              this.props.addSurveyData(this.props.draftId, 'familyData', {
                familyMembersList: familyMembersList
              })
              this.props.nextStep()
            }
          }
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
                </p>
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
  addSurveyData,
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
