import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import lifemap_begin_image from '../../../assets/lifemap_begin_image.png'

import AppNavbar from '../../../components/AppNavbar'

class BeginLifemap extends Component {
  render() {
    const { t } = this.props
    return (
      <div>
        <AppNavbar
          text="Your Life Map"
          showBack={true}
          backHandler={this.props.parentPreviousStep}
        />
        <div className="text-center" style={{ padding: '100px 20px' }}>
          <h2 style={{ paddingBottom: '50px' }}>
            {t('views.lifemap.thisLifeMapHas').replace('%n', this.props.data)}
          </h2>
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
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ surveys }) => ({
  surveys
})

export default withI18n()(connect(mapStateToProps)(BeginLifemap))
