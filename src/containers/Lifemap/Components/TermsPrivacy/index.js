import React, { Component } from 'react'
import { connect } from 'react-redux'
import TermsPrivacyPresentational from './TermsPrivacyPresentational'

class TermsPrivacy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0
    }
  }

  nextStep = () => {
    const { step } = this.state
    this.setState({ step: step + 1 })
  }

  previousStep = () => {
    const { step } = this.state
    this.setState({ step: step - 1 })
  }

  render() {
    let data = null
    let header = ''
    let nextStepFunc = this.nextStep
    if (this.state.step === 0) {
      data = this.props.data.termsConditions
      header = 'Terms & Conditions'
    } else {
      data = this.props.data.privacyPolicy
      header = 'Privacy Policy'
      nextStepFunc = this.props.parentNextStep
    }

    return (
      <div style={{ marginTop: 50 }}>
        {
          <TermsPrivacyPresentational
            data={data}
            header={header}
            nextStep={nextStepFunc}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {}

export default connect(
  null,
  mapDispatchToProps
)(TermsPrivacy)
