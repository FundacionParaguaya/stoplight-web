import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import lifemap_complete_image from '../../../assets/lifemap_complete_image.png'

class FinalScreen extends Component {
  render() {
    const { t } = this.props
    return (
      <div style={{ marginTop: 50 }}>
        <h2> {t('views.yourLifeMap')} </h2>
        <hr />
        <h3> {t('views.lifemap.great')}</h3>
        <h3> {t('views.lifemap.youHaveCompletedTheLifemap')}</h3>
        <div className="text-center">
          <img src={lifemap_complete_image} alt="lifemap_complete_image" />
        </div>
        <button className="btn btn-success">{t('general.close')}</button>
        <button className="btn btn-success"> Go Back </button>
      </div>
    )

  }
}

export default withI18n()(FinalScreen)
