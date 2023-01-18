const passportJwt = require("passport-jwt");
const mongoose = require("mongoose");

const { UserModel } = require("../models");
const keys = require("../config/keys");

const { ExtractJwt, Strategy: JwtStrategy } = passportJwt;

// Define passport-jwt options here
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey,
};

// Export passport function with jwt strategy used
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      UserModel.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
