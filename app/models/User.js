const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  // Add your schema here
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Encrypt the password before saving in the database
UserSchema.pre("save", function (next) {
  const user = this;

  // Generate salt and hash
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // Set the user's password to the hashed version
      user.password = hash;
      next();
    });
  });
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
