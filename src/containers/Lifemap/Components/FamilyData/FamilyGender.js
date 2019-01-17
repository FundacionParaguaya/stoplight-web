import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

class FamilyGender extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberCount: 0
    }
  }
  handleChange = event => {
    this.setState({ memberCount: event.target.value })
  }

  //TODO: handler to skip to map view if only 1 family member!

  render() {
    const draft = this.props.drafts.filter(
      draft => (draft.id = this.props.draftId)
    )[0]
    const members = draft.family_data.familyMembersList
    const forms = members.map((member, idx) => {
      return (
        <div key={idx}>
          <Field
            name={`gender-${idx}`}
            component="select"
            className="custom-select"
          >
            <option value="">Select gender</option>
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
      <div style={{ marginTop: 50 }}>
        <Form
          onSubmit={(values, form) => {
            console.log(this.props.drafts)
            // let format = { familyMembersList: [] }
            // format.familyMembersList = values
            // this.props.addSurveyDataWhole(
            //   this.props.draftId,
            //   'family_data',
            //   format
            // )
            // this.props.nextStep()
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
                <label>gender: </label>
                <p type="text" className="form-control" placeholder="" />
              </div>
              {forms}
              <div style={{ paddingTop: 20 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm btn-block"
                  disabled={pristine || invalid}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FamilyGender)
