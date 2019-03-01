import React, { Component } from 'react'
import { withI18n } from 'react-i18next'
import lifemap_complete_image from '../../../assets/lifemap_complete_image.png'
import AppNavbar from '../../../components/AppNavbar'

class FinalScreen extends Component {
  render() {
    const { t, submitDraft, submitError } = this.props
    return (
      <div>
        <AppNavbar
          text={t('views.yourLifeMap')}
          showBack={true}
          backHandler={this.props.parentPreviousStep}
        />
        <div className="text-center" style={{ padding: '100px 20px' }}>
          <h2 style={{ paddingBottom: '50px' }}>
            {t('views.lifemap.great')}
            <br />
            {t('views.lifemap.youHaveCompletedTheLifemap')}
          </h2>
          <img src={lifemap_complete_image} alt="lifemap_complete_image" />
          {submitError && (
            <div style={{ color: 'red', margin: '1em' }}>
              {' '}
              There was an error in submitting. The data is still in your
              browser. Please do not close the browser and contact Poverty
              Stoplight as soon as possible.
            </div>
          )}
        </div>
        <div style={{ paddingTop: 20 }}>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={submitDraft}
          >
            {t('general.close')}
          </button>
        </div>
      </div>
    )
  }
}

export default withI18n()(FinalScreen)
