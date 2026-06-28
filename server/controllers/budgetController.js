const Budget = require('../models/Budget');
const { validationResult } = require('express-validator');

// Create a new budget
const createBudget = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { category, limit } = req.body;

    const existingBudget = await Budget.findOne({ userId: req.user._id, category });
    if (existingBudget) {
      const err = new Error('Budget for this category already exists');
      err.statusCode = 400;
      return next(err);
    }

    const budget = await Budget.create({
      userId: req.user._id,
      category,
      limit
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

const Transaction = require('../models/Transaction');

// Get all budgets for the user
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).lean();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const expenseMap = {};
    expenses.forEach(e => {
      expenseMap[e._id] = e.totalSpent;
    });

    const budgetsWithSpent = budgets.map(b => ({
      ...b,
      spent: expenseMap[b.category] || 0
    }));

    res.json({ success: true, data: budgetsWithSpent });
  } catch (error) {
    next(error);
  }
};

// Update a budget
const updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      const err = new Error('Budget not found');
      err.statusCode = 404;
      return next(err);
    }

    if (budget.userId.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to update this budget');
      err.statusCode = 403;
      return next(err);
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

// Delete a budget
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      const err = new Error('Budget not found');
      err.statusCode = 404;
      return next(err);
    }

    if (budget.userId.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to delete this budget');
      err.statusCode = 403;
      return next(err);
    }

    await budget.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
};
