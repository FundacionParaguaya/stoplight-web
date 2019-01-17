import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormSpy, Form, Field } from 'react-final-form'
import { addSurveyData, addSurveyDataWhole } from '../../../../redux/actions'

class FamilyMembers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberCount: 0
    }
  }
  myOnChange = event => {
    this.setState({ memberCount: event.target.value })
  }

  render() {
    const forms = []
    for (let i = 0; i < this.state.memberCount; i++) {
      forms.push(
        <div key={`membernId${i + 2}`}>
          <Field name={`membername${i + 2}`}>
            {({ input, meta }) => (
              <div className="form-group">
                <label>name: </label>
                <input
                  type="text"
                  {...input}
                  className="form-control"
                  placeholder=""
                />
                {meta.touched && meta.error && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
        </div>
      )
    }
    return (
      <div style={{ marginTop: 50 }}>
        <Form
          onSubmit={(values, form) => {
            let format = { familyMembersList: [] }
            format.familyMembersList = values
            this.props.addSurveyDataWhole(
              this.props.draftId,
              'family_data',
              format
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
              <FormSpy
                subscription={{ values: true }}
                component={({ values }) => {
                  if (values) {
                    //  console.log('formspy stuff: ', values)
                  }
                  return ''
                }}
              />
              <div>
                <label>Number of people living in this household: </label>
                <div className="form-group">
                  <Field name="memberCount">
                    {({ input, meta }) => {
                      const { onChange } = input
                      const mergedOnChange = e => {
                        this.myOnChange(e)
                        onChange(e)
                      }
                      const newInput = { ...input, onChange: mergedOnChange }
                      return (
                        <select {...newInput} className="custom-select">
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
                      )
                    }}
                  </Field>
                </div>
              </div>
              <div className="form-group">
                <label>name: </label>
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
)(FamilyMembers)
