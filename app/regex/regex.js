const regex = {
  // Tests for a valid email address
  email:
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,

  // Tests for a string with 6 or more characters, containing at least one upper case letter, one lower case letter and one digit.
  password: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
};

module.exports = regex;
