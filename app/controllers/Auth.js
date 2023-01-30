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

  //Check if email already exists
  user && res.status(409).json({ message: "Email already exists" });

  // Create new user
  const newUser = new UserModel({
    email,
    password,
  });

  // Save user
  await newUser.save();

  return res.status(200).json({ message: "User successfully created" });
});

// @route POST api/auth/verifyEmail
// @desc check for existing email
// @access Public

const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });

  // If user doesn't exist, reply not found
  !user &&
    res
      .status(404)
      .json({ userFound: false, message: "This email address does not exist" });

  // Respond with user email
  return res.status(200).json({ userFound: true, email });
});

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });

  // If user doesn't exist
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
    return res.status(400).json({ message: "Password incorrect" });
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
  verifyEmail,
  googleCallback,
};

module.exports = AuthController;
