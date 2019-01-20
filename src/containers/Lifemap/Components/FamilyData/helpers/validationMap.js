export const validate = values => {
  const errors = {}
  if (!values.country) {
    errors.country = 'Required'
  }
  return errors
}
