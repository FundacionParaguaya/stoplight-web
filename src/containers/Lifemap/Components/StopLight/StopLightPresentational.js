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
  parentPreviousStep,
  imagesLoaded,
  updateImageStatus
}) => {
  let progressPercent = ((index + 1) / (total + 1)) * 100
  return (
    <div>
      <div className="text-center">
        <h4 style={{ color: 'grey' }}>{data.dimension}</h4>
        <h2>{data.questionText}</h2>
      </div>
      <div className="progress" style={{ marginBottom: '1em' }}>
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${progressPercent}%` }}
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
      <div className="row">
        <div className="col-4">
          <button
            type="submit"
            onClick={() => nextStep(data.stoplightColors[0], data.codeName)}
            className="stoplight-btn"
          >
            <IndicatorCard
              url={data.stoplightColors[0].url}
              description={data.stoplightColors[0].description}
              cardClass="card card-stoplight text-white bg-success mb-3"
              imagesLoaded={imagesLoaded}
              cardImageLoaded={() => {
                updateImageStatus()
              }}
            />
          </button>
        </div>
        <div className="col-4">
          <button
            type="submit"
            onClick={() => nextStep(data.stoplightColors[1], data.codeName)}
            className="stoplight-btn"
          >
            <IndicatorCard
              url={data.stoplightColors[1].url}
              description={data.stoplightColors[1].description}
              cardClass="card card-stoplight text-white bg-warning mb-3"
              imagesLoaded={imagesLoaded}
              cardImageLoaded={() => {
                updateImageStatus()
              }}
            />
          </button>
        </div>
        <div className="col-4">
          <button
            type="submit"
            onClick={() => nextStep(data.stoplightColors[2], data.codeName)}
            className="stoplight-btn"
          >
            <IndicatorCard
              url={data.stoplightColors[2].url}
              description={data.stoplightColors[2].description}
              cardClass="card card-stoplight text-white bg-danger mb-3"
              imagesLoaded={imagesLoaded}
              cardImageLoaded={() => {
                updateImageStatus()
              }}
            />
          </button>
        </div>
      </div>

      <hr />
      <br />
      <p className="col-4">
        {!data.required && (
          <button
            type="submit"
            className="btn btn-link"
            style={{ color: 'grey' }}
            onClick={() => nextStep(0, data.codeName)}
          >
            {t('views.lifemap.skipThisQuestion')}
          </button>
        )}
      </p>
    </div>
  )
}

export default withI18n()(StopLightPresentational)
