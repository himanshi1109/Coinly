const { check } = require('express-validator');

// Validation rules for user registration
const registerValidator = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

// Validation rules for user login
const loginValidator = [
  check('email', 'Please include a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').exists()
];

module.exports = { registerValidator, loginValidator };
