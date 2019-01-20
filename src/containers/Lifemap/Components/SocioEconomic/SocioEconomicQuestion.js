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
                  type="text"
                  {...input}
                  className="form-control"
                  placeholder=""
                />
                {meta.touched && meta.error && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
        ) : (
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
        )}
      </div>
      <ErrorComponent name={question.codeName} />
    </div>
  )
}

export default SocioEconomicQuestion
