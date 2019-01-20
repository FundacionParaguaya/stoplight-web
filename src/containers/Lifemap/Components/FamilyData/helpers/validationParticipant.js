function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.log(re.test(email))
  return re.test(email);
}

export const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  if (!values.gender) {
    errors.gender = 'Required'
  }
  if (!values.documentNumber) {
    errors.documentNumber = 'Required'
  }
  if (!values.documentType) {
    errors.documentType = 'Required'
  }
  if (!values.birthCountry) {
    errors.birthCountry = 'Required'
  }
  if(values.email && !validateEmail(values.email)){
    errors.email = 'Please enter valid email'
  }
  return errors
}
