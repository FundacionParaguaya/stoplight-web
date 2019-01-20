export const validate = values => {
  const errors = {}
  if (!values.reason) {
    errors.reason = 'Required'
  }
  return errors
}
