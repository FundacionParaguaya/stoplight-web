import React from 'react'
import { withI18n } from 'react-i18next'
import IndicatorCard from './IndicatorCard'

const StopLightPresentational = ({
  t,
  data,
  index,
  total,
  nextStep,
  previousStep,
  parentPreviousStep
}) => {
  return (
    <div>
      <div>
        <h2>{data.dimension}</h2>
        <h3>{data.questionText}</h3>
        <p>{`${index + 1}/${total+1}`}</p>
      </div>
      <div>
        <div className="row">
          <div className="col-lg-4">
            <button
              type="submit"
              onClick={() => nextStep(data.stoplightColors[0], data.codeName)}
              className="bg-success"
            >
              <IndicatorCard
                url={data.stoplightColors[0].url}
                description={data.stoplightColors[0].description}
                cardClass="card text-white bg-success mb-3"
              />
            </button>
          </div>
          <div className="col-lg-4">
            <button
              type="submit"
              onClick={() => nextStep(data.stoplightColors[1], data.codeName)}
              className="bg-warning"
            >
              <IndicatorCard
                url={data.stoplightColors[1].url}
                description={data.stoplightColors[1].description}
                cardClass="card text-white bg-warning mb-3"
              />
            </button>
          </div>
          <div className="col-lg-4">
            <button
              type="submit"
              onClick={() => nextStep(data.stoplightColors[2], data.codeName)}
              className="bg-danger"
            >
              <IndicatorCard
                url={data.stoplightColors[2].url}
                description={data.stoplightColors[2].description}
                cardClass="card text-white bg-danger mb-3"
              />
            </button>
          </div>
        </div>

        <hr />
        <br />
        <p clasName="col-4">
          {!data.required && (
            <button type="submit" className="btn btn-lg" onClick={() => nextStep(0, data.codeName)}>
              {t('views.lifemap.skipThisQuestion')}
            </button>
          )}
        </p>

        <button
          className="btn btn-lg"
          onClick={() => {
            if (index === 0) {
              parentPreviousStep()
            } else {
              previousStep()
            }
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

export default withI18n()(StopLightPresentational)
