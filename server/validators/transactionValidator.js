const { check } = require('express-validator');

// Validation rules for creating a transaction
const createTransactionValidator = [
  check('type', 'Type must be income or expense').isIn(['income', 'expense']),
  check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
  check('category', 'Category is required').notEmpty(),
  check('date', 'Date must be a valid ISO string').optional().isISO8601()
];

module.exports = { createTransactionValidator };
