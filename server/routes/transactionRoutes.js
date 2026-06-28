const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { createTransactionValidator } = require('../validators/transactionValidator');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTransactionValidator, createTransaction)
  .get(protect, getTransactions);

router.route('/:id')
  .get(protect, getTransactionById)
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
