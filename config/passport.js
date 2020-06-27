const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Customer = mongoose.model('customers');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// module.exports = passport => {
//   passport.use(
//     new JwtStrategy(opts, function(jwt_payload, done) {
//       Customer.findOne({ id: jwt_payload.id }, function(
//         err,
//         customer,
//       ) {
//         if (err) {
//           return done(err, false);
//         }
//         if (customer) {
//           return done(null, customer);
//         } else {
//           return done(null, false);
//           // or you could create a new account
//         }
//       });
//     }),
//   );
// };

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Customer.findById(jwt_payload.id)
        .then(customer => {
          if (customer) {
            return done(null, customer);
          }

          return done(null, false);
        })
        .catch(err => console.log(err));
    }),
  );
};
