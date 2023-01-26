const express = require("express");
const passport = require("passport");
const { AuthController } = require("../controllers");
const cors = require("cors");

const router = express.Router();

// Sign up router defined here
router.post("/signup", AuthController.signup);

// Login router defined here
router.post("/login", AuthController.login);

router.post("/checkEmail", AuthController.checkEmail);

// Google login router  defined here
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback router defined here
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureMessage: true,
    session: false,
  }),
  AuthController.googleCallback
);

module.exports = router;
