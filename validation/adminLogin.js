const validator = require('validator');
const isEmpty = require('./isEmpty.js');

module.exports = function validateAdminLogin(data) {
  const errors = {};

  // Making sure the data is string when empty
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
