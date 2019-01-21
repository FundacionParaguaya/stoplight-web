import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import lifemap_begin_image from '../../../assets/lifemap_begin_image.png'

class BeginLifemap extends Component {
  render() {
    const { t } = this.props
    return (
      <div style={{ marginTop: 50 }}>
        <h3>
          {t('views.lifemap.thisLifeMapHas').replace('%n', this.props.data)}
        </h3>
        <div className="text-center">
          <img src={lifemap_begin_image} alt="lifemap_begin_image" />
        </div>
        <div style={{ paddingTop: 20 }}>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={() => this.props.nextStep()}
          >
            Continue
          </button>
          <button
            className="btn btn-lg"
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
