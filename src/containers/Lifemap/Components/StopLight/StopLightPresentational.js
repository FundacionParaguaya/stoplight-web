import React from 'react'
import IndicatorCard from './IndicatorCard'

const StopLightPresentational = ({
  data,
  index,
  total,
  nextStep,
  previousStep,
  parentPreviousStep
}) => {
  console.log(data)
  return (
    <div>
      <div>
        <p>{data.questionText}</p>
        <p>{`${index + 1}/${total}`}</p>
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

            <IndicatorCard url={data.stoplightColors[2].url} description={data.stoplightColors[2].description} cardClass="card text-white bg-danger mb-3"/>
            </button>
          </div>
        </div>

        <hr />
        <br />
        <p>
          {!data.required && (
            <button type="submit" onClick={() => nextStep(0, data.codeName)}>
              Skip this question
            </button>
          )}
        </p>

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
