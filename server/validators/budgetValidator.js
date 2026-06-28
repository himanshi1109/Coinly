const { check } = require('express-validator');

// Validation rules for creating a budget
const createBudgetValidator = [
  check('category', 'Category is required').notEmpty(),
  check('limit', 'Limit must be a positive number').isFloat({ gt: 0 })
];

module.exports = { createBudgetValidator };
