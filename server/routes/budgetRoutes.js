const express = require('express');
const router = express.Router();
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');
const { createBudgetValidator } = require('../validators/budgetValidator');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBudgetValidator, createBudget)
  .get(protect, getBudgets);

router.route('/:id')
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

module.exports = router;
