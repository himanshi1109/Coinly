const jwt = require('jsonwebtoken');

// Takes userId, returns signed JWT using JWT_SECRET and JWT_EXPIRE from process.env
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = generateToken;
