import React from 'react'
import { Link } from 'react-router-dom'
import { withI18n } from 'react-i18next'
import Checkbox from '../../../../assets/Checkbox.png'
const TermsPrivacyPresentational = ({ data, header, nextStep, t }) => {
  return (
    <div style={{ marginTop: 50 }}>
      <h2>{header}</h2>
      <hr />
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
        <p className="lead text-center" >

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
