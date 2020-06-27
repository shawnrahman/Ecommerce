const validator = require('validator');
const isEmpty = require('./isEmpty.js');

module.exports = function validateCustomerRegistration(data) {
  const errors = {};

  // Making sure the data is string when empty
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 to 30 charecters';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  if (validator.isEmpty(data.phone)) {
    errors.phone = 'Phone field is required';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm passward field is required';
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
