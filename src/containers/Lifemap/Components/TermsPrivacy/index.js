import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withI18n } from 'react-i18next'
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
    const { t } = this.props
    let data = null
    let header = ''
    let nextStepFunc = this.nextStep
    if (this.state.step === 0) {
      data = this.props.data.termsConditions
      header = t('views.termsConditions')
    } else {
      data = this.props.data.privacyPolicy
      header = t('views.privacyPolicy')
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

export default withI18n()(connect(
  null,
  mapDispatchToProps
)(TermsPrivacy))
