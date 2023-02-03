const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const regex = require("../regex/regex");

const UserSchema = new mongoose.Schema({
  // Add your schema here
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      validator: (val) => regex.email.test(val),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: function () {
      return this.signUpMethod === "local";
    },
    validate: {
      validator: (val) => regex.password.test(val),
      message: () =>
        "Password must be 6 characters long, contain at least 1 upper case letter, one lower case letter and 1 digit",
    },
  },
  signUpMethod: {
    type: String,
    required: true,
  },
});

// Encrypt the password before saving in the database
UserSchema.pre("save", function (next) {
  const user = this;
  const { password } = user;

  // If password is provided ? Hash password : move to next middleware
  password
    ? bcrypt.genSalt(10, (err, salt) => {
      // error ? return err : hash password
        err
          ? next(err)
          : bcrypt.hash(password, salt, (err, hash) => {
              err && next(err);

              // Set the user's password to the hashed version
              if (!err) {
                user.password = hash;
                next();
              }
            });
      })
    : next();
});

// Compare the provided password against the stored hash
UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
};

// Create the model
const User = mongoose.model("users", UserSchema);

const UserModel = User;

module.exports = UserModel;
