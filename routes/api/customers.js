const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

// Load Custoemr Model
const Customer = require('../../models/Customer');

// eslint-disable-next-line new-cap
const router = express.Router();

// Load Input validators
const validateCustomerRegisterInput = require('../../validation/customerRegistration');
const validateCustomerLoginInput = require('../../validation/customerLogin');

// @route Get api/customers/test
// @Desc Tests customers route
// @access Public
router.get('/test', (req, res) =>
  res.json({ msg: 'customers works' }),
);

// @route Get api/customers/register
// @Desc Register customer
// @access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateCustomerRegisterInput(req.body);

  // Validate
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Customer.findOne({ email: req.body.email }).then(customer => {
    if (customer) {
      errors.email = 'Email already exists';
      return res.status(400).json({ errors });
    } else {
      const newAvatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });

      const newCustomer = new Customer({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        avatar: newAvatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newCustomer.password, salt, (err, hash) => {
          if (err) throw err;
          newCustomer.password = hash;
          newCustomer
            .save()
            .then(customer => res.json(customer))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route Get api/customers/login
// @Desc login customer/Return JWT token
// @access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateCustomerLoginInput(req.body);
  // Validate
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find customer by email
  Customer.findOne({ email: email }).then(customer => {
    // Check for customer
    if (!customer) {
      errors.email = 'Customer not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, customer.password).then(isMatch => {
      if (isMatch) {
        // Customer Matched. Create JWT payload
        const payload = {
          id: customer.id,
          name: customer.name,
          avatar: customer.avatar,
        };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: 'Bearer ' + token });
          },
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route Get api/customers/currentt
// @Desc Return Current customer
// @access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  },
);

module.exports = router;
