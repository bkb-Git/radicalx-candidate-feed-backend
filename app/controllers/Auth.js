const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { UserModel } = require("../models");
const keys = require("../config/keys");

// @route POST api/auth/signup
// @desc Signup new user
// @access Public

const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find email that may exist
  const user = await UserModel.findOne({ email });

  // Function to create user
  const createNewUser = async (signUpData) => {
    // Create new user
    const newUser = new UserModel(signUpData);

    // Save user
    await newUser.save().catch((err) => {
      const { errors } = err;

      // Response json
      const resObj = {};

      // Extract object keys
      const errorKeys = Object.keys(errors);

      //Iterate errors object and retrieve messages
      for (const key of errorKeys) {
        resObj[key] = errors[key].message;
      }

      // Error handler on save
      return res.status(400).json(resObj);
    });

    return res.status(200).json({ message: "User successfully created" });
  };

  // User exists ? return "Email already exists" : create new user
  user
    ? res.status(409).json({ message: "Email already exists" })
    : createNewUser({
        email,
        password,
        signUpMethod: "local",
      });
});

// @route POST api/auth/verifyEmail
// @desc check for existing email
// @access Public

const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });

  // user exists ? return true with email : return false with message
  user
    ? res.status(200).json({ userFound: true, email })
    : res.status(404).json({
        userFound: false,
        message: "This email address does not exist",
      });
});

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });

  // User does not exist ? return user not found : comparePassword 
  !user
    ? res.status(404).json({ message: "User not found" })
    : await user.comparePassword(password, (err, isMatch) => {
        // Password match ? sign token : password incorrect
        isMatch
          ? jwt.sign(
              { id: user.id, email: user.email },
              keys.secretOrKey,
              { expiresIn: 3600 },
              // Callback function to assign token
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            )
          : res.status(400).json({ message: "Password incorrect" });
      });
});

// @route  GET api/auth/google/callback
// @desc sign token for google user sign in
// @access Public

const googleCallback = (req, res) => {
  // User payload
  const userPayload = {
    id: req.user.id,
    email: req.user.email,
  };

  // Sign Token
  return jwt.sign(
    userPayload,
    keys.GOOGLE_CLIENT_SECRET,
    { expiresIn: 3600 },
    // Callback function to assign token
    (err, token) => {
      res.json({
        success: true,
        token: "Bearer " + token,
      });
    }
  );
};

const AuthController = {
  login,
  signup,
  verifyEmail,
  googleCallback,
};

module.exports = AuthController;
