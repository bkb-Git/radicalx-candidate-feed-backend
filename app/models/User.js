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
  },
});

// Encrypt the password before saving in the database
UserSchema.pre("save", function (next) {
  const user = this;

  // Password is given
  user.password && // Generate salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        // Set the user's password to the hashed version
        user.password = hash;
        next();
      });
    });

  return next();
});

// Compare the provided password against the stored hash
UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Create the model
const User = mongoose.model("users", UserSchema);

const UserModel = User;

module.exports = UserModel;
