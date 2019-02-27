import React from 'react'
import { Field } from 'react-final-form'
import ErrorComponent from '../../ErrorComponent'

const SocioEconomicQuestion = ({ question }) => {
  return (
    <div key={question.codeName}>
      <label>{question.questionText} </label>
      <div className="form-group">
        {question.answerType !== 'select' ? (
          <Field name={question.codeName}>
            {({ input, meta }) => (
              <div className="form-group">
                <input
                  type={question.answerType === 'string' ? 'text' : 'number'}
                  {...input}
                  className="form-control"
                  placeholder=""
                />
                <ErrorComponent name={question.codeName} />
              </div>
            )}
          </Field>
        ) : (
          <div>
            <Field
              name={question.codeName}
              component="select"
              className="custom-select"
            >
              <option value="">Select type</option>
              {question.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </Field>
            <ErrorComponent name={question.codeName} />
          </div>
        )}
      </div>
    </div>
  )
}

export default SocioEconomicQuestion
