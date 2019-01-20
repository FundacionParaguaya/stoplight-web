import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'

class BeginLifemap extends Component {
  render() {
    const { t } = this.props
    return (
      <div style={{ marginTop: 50 }}>
        <p>
          {t('views.lifemap.thisLifeMapHas').replace('%n', this.props.data)}
        </p>
        <div style={{ paddingTop: 20 }}>
          <button
            type="submit"
            className="btn btn-primary btn-sm btn-block"
            onClick={() => this.props.nextStep()}
          >
            Continue
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              this.props.parentPreviousStep()
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

export default withI18n()(connect(mapStateToProps)(BeginLifemap))
