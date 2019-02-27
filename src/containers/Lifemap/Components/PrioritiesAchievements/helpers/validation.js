export const validate = values => {
  const errors = {}
  if (!values.estimatedDate && typeof(values.estimatedDate === 'number')) {
    errors.reason = 'Required'
  }

  return errors
}
