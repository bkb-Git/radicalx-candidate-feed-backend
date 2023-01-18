const express = require("express");
const { AuthController } = require("../controllers");

const router = express.Router();

// Sign up router defined here
router.post("/signup", AuthController.signup);

// Login router defined here
router.post("/login", AuthController.login);

module.exports = router;
