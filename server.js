const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv").config();
const cors = require("cors");

// Import candidate routes

const routes = require("./app/routes");

// Import function to connect to mongoDB database

const connectDB = require("./app/config/db");

// Connect to mongoDB database called here

connectDB();

// Port is defined here

const port = process.env.PORT || 5000;

// Express app called here
const app = express();

// Add cors

app.use(
  cors({
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Add passport as middleware
app.use(passport.initialize());

// Import Passport configuration
require("./app/config/passport")(passport);

// Candidate routes used here
app.use("/api/candidates", routes.CandidatesRoute);

// Authentication routes used here
app.use("/api/auth", cors(), routes.AuthRoute);

// Listening at port 5000

app.listen(port, () => console.log(`Server started on port : ${port}`));
