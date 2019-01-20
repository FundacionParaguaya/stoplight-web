import React from 'react'
import { Link } from 'react-router-dom'
import Checkbox from '../../../../assets/Checkbox.png'
const TermsPrivacyPresentational = ({ data, header, nextStep }) => {
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
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            href="#"
            onClick={() => nextStep()}
          >
            Agree
          </button>
          <Link to={`/`}>
            <button className="btn btn-primary btn-lg" href="#">
              Disagree
            </button>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default TermsPrivacyPresentational
