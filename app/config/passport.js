const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

const { UserModel } = require("../models");
const keys = require("../config/keys");

// Google Strategy defined here
const googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.GOOGLE_CLIENT_ID,
        clientSecret: keys.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // Extract primary google email
        const { emails } = profile;
        const email = emails[0].value;

        // Find user by email
        const user = await UserModel.findOne({ email });

        // Function to create new user
        const createNewUser = async (signUpData) => {
          const createdUser = new UserModel(signUpData);
          const newUser = await createdUser.save();

          return done(null, newUser);
        };

        // If user exists ? return user : create new user
        user
          ? done(null, user)
          : createNewUser({ email, signUpMethod: "google" });
      }
    )
  );
};

// Extract jwt from Auth Header

// jwt Strategy defined here
const jwtStrategy = (passport, type) => {
  // Secret or Key to be used
  const secretOrKeyToUse =
    type === "google" ? keys.GOOGLE_CLIENT_SECRET : keys.secretOrKey;

  // jwtOptions defined here
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretOrKeyToUse,
  };

  return passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // Find user by id
      UserModel.findById(jwt_payload.id)
        .then((user) => {
          // User exists, return user object : return false
          user ? done(null, user) : done(null, false);
        
        })
        .catch((err) => console.log(err));
    })
  );
};

// Export passport function with jwt strategy used
module.exports = (passport) => {
  // Jwt Strategy generic secret
  jwtStrategy(passport);

  // Jwt Strategy with google secret
  jwtStrategy(passport, "google");

  //Google strategy called here
  googleStrategy(passport);
};
