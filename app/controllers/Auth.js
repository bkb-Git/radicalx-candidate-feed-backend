const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const { UserModel } = require("../models");
const keys = require("../config/keys");

// @route POST api/auth/signup
// @desc Signup new user
// @access Public

const signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find email that may exit
  const user = await UserModel.findOne({ email });

  //Check if email already exists
  user && res.status(409).json({ message: "Email already exists" });

  // Create new user
  const newUser = new UserModel({
    email,
    password,
  });

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
});

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  !user && res.status(404).json({ message: "User not found" });

  // Check password
  await user.comparePassword(password, (err, isMatch) => {
    // Password matched
    if (isMatch) {
      // Create JWT Payload
      const userPayload = {
        id: user.id,
        email: user.email,
      };

      // Sign Token
      return jwt.sign(
        userPayload,
        keys.secretOrKey,
        { expiresIn: 3600 },
        // Callback function to assign token
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        }
      );
    }

    // Password did not match
    return res.status(400).json({ password: "Password incorrect" });
  });
});

// @route GET api/auth/google/callback
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
  googleCallback,
};

module.exports = AuthController;
