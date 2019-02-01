import React from 'react'
import { Link } from 'react-router-dom'
import { withI18n } from 'react-i18next'
import Checkbox from '../../../../assets/Checkbox.png'
import AppNavbar from '../../../../components/AppNavbar'
const TermsPrivacyPresentational = ({ data, header, nextStep, previousStep, t }) => {
  return (
    <div>
      <AppNavbar text={header} showBack={true} draftOngoing={false} backHandler={() => previousStep()}/>
      <div className="text-center">
        <img src={Checkbox} alt="chekbox" />
      </div>
      <div>
        <div className="text-center">
          <h3>{data.title}</h3>
          <hr className="my-4" />
        </div>
        <p
          dangerouslySetInnerHTML={{
            __html: data.text.split('\\n').join('<br/>')
          }}
        />
        <p className="lead text-center">
          <Link to={`/surveys`}>
            <button className="btn btn-lg col-4" href="#">
              {t('general.disagree')}
            </button>
          </Link>
          <button
            className="btn btn-primary btn-lg col-4"
            href="#"
            onClick={() => nextStep()}
          >
            {t('general.agree')}
          </button>
        </p>
      </div>
    </div>
  )
}

export default withI18n()(TermsPrivacyPresentational)
