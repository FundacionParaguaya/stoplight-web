import React from 'react'

const StopLightPresentational = ({
  data,
  index,
  total,
  nextStep,
  previousStep
}) => {
  console.log(data)
  return (
    <div>
      <div>
        <p>{`${index + 1}. ${data.questionText}`}</p>
        <p>{`${index + 1}/${total}`}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <button
          type="submit"
          onClick={() => nextStep(index, data.stoplightColors[0].value)}
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
          onClick={() => nextStep(index, data.stoplightColors[1].value)}
        >
          <div
            className="card text-white bg-danger mb-3"
            styles={{ maxWidth: '10%' }}
          >
            <div className="card-header" styles={{ maxWidth: '25%' }}>
              {data.stoplightColors[1].description}
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
          onClick={() => nextStep(index, data.stoplightColors[2].value)}
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
      </div>
    </div>
  )
}

export default StopLightPresentational
