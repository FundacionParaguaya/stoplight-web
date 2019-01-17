import React from 'react'

const StopLightPresentational = ({
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
        <p>{data.questionText}</p>
        <p>{`${index + 1}/${total}`}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <button
          type="submit"
          onClick={() => nextStep(data.stoplightColors[0], data.codeName)}
          styles={{ maxWidth: '10%' }}
        >
          <div
            className="card text-white bg-success mb-3"
            styles={{ maxWidth: '10%' }}
          >
            <div className="card-header" styles={{ maxWidth: '25%' }}>
              {data.stoplightColors[0].description}
            </div>
            <div className="card-body">
              <img
                src={data.stoplightColors[0].url}
                alt={data.stoplightColors[0].description}
                styles={{ maxWidth: '25%' }}
              />
            </div>
          </div>
        </button>
        <button
          type="submit"
          onClick={() => nextStep(data.stoplightColors[1], data.codeName)}
        >
          <div
            className="card text-white bg-danger mb-3"
            styles={{ maxWidth: '10%' }}
          >
            <div className="card-header" styles={{ maxWidth: '25%' }}>
              {data.stoplightColors[2].description}
            </div>
            <div className="card-body">
              <img
                src={data.stoplightColors[1].url}
                alt={data.stoplightColors[1].description}
                styles={{ maxWidth: '25%' }}
              />
            </div>
          </div>
        </button>
        <button
          type="submit"
          onClick={() => nextStep(data.stoplightColors[2], data.codeName)}
        >
          <div
            className="card text-white bg-warning mb-3"
            styles={{ maxWidth: '10%' }}
          >
            <div className="card-header">
              {data.stoplightColors[2].description}
            </div>
            <div className="card-body">
              <img
                src={data.stoplightColors[2].url}
                alt={data.stoplightColors[2].description}
                styles={{ maxWidth: '25%' }}
              />
            </div>
          </div>
        </button>

        <button
          className="btn btn-primary btn-lg"
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

export default StopLightPresentational
