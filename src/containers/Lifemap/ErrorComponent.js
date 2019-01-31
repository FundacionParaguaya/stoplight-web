import React from 'react'
import { Field } from 'react-final-form'
const ErrorComponent = ({ name }) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? (
        <span
        style={{marginTop:" 1rem"}}
        className="badge badge-pill badge-danger">{error}</span>
      ) : null
    }
  />
)
export default ErrorComponent
