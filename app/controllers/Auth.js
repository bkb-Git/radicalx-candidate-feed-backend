const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const { UserModel } = require("../models");
const keys = require("../config/keys");

// @route POST api/login
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

// @route POST api/signup
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
  await newUser.save();

  return res.status(200).json({ message: "User successfully created" });
});

const AuthController = {
  login,
  signup,
};

module.exports = AuthController;
