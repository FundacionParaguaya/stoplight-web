import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withI18n } from 'react-i18next'
import { withRouter } from 'react-router-dom'
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
    if(this.state.step === 0){
      this.props.history.push('/surveys')
    }
    const { step } = this.state
    this.setState({ step: step - 1 })
  }

  render() {
    const { t } = this.props
    let data = null
    let header = ''
    let nextStepFunc = this.nextStep
    let prevStepFunc = this.previousStep
    if (this.state.step === 0) {
      data = this.props.data.termsConditions
      header = t('views.termsConditions')
    } else {
      data = this.props.data.privacyPolicy
      header = t('views.privacyPolicy')
      nextStepFunc = this.props.parentNextStep
    }

    return (
      <div>
        {
          <TermsPrivacyPresentational
            data={data}
            header={header}
            nextStep={nextStepFunc}
            previousStep={prevStepFunc}
          />
        }
      </div>
    )
  }
}

const mapDispatchToProps = {}

export default withRouter(withI18n()(connect(
  null,
  mapDispatchToProps
)(TermsPrivacy)))
