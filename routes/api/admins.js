const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');

// Load Admin Model
const Admin = require('../../models/Admin');

// eslint-disable-next-line new-cap
const router = express.Router();

// Load Input validators
const validateAdminRegisterInput = require('../../validation/adminRegistration.js');
const validateAdminLoginInput = require('../../validation/adminLogin.js');

// @route Get api/admins/test
// @Desc Tests admins route
// @access Public
router.get('/test', (req, res) => {
  res.json({ msg: 'admins works' });
});

// @route Get api/admin/register
// @Desc Register admin
// @access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateAdminRegisterInput(req.body);

  // Validate
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Admin.findOne({ email: req.body.email }).then(admin => {
    if (admin) {
      errors.email = 'Email already exists';
      return res.status(400).json({ errors });
    } else {
      const newAvatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      });

      const newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        avatar: newAvatar,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          if (err) throw err;
          newAdmin.password = hash;
          newAdmin
            .save()
            .then(admin => res.json(admin))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route Get api/admin/login
// @Desc login admin/Return JWT token
// @access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateAdminLoginInput(req.body);
  // Validate
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find admin by email
  Admin.findOne({ email: email }).then(admin => {
    // Check for admin
    if (!admin) {
      errors.email = 'Admin not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, admin.password).then(isMatch => {
      if (isMatch) {
        // admin Matched. Create JWT payload
        const payload = {
          id: admin.id,
          name: admin.name,
          avatar: admin.avatar,
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
// @Desc Return Current admin
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
