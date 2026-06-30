const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// Helper to check budget limit and trigger warning notification
const checkBudgetLimit = async (userId, category) => {
  try {
    const budget = await Budget.findOne({ userId, category });
    if (!budget) return;

    const transactions = await Transaction.find({
      userId,
      category,
      type: 'expense'
    });
    
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    if (totalSpent > budget.limit) {
      await Notification.create({
        userId,
        title: 'Budget Limit Exceeded ⚠️',
        message: `Your total expenses in "${category}" have reached ₹${totalSpent.toLocaleString()} which exceeds your set budget limit of ₹${budget.limit.toLocaleString()}!`,
        type: 'danger'
      });
    }
  } catch (err) {
    console.error('Error checking budget limits:', err);
  }
};

// Create a new transaction
const createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { type, amount, category, notes, date } = req.body;

    if (type === 'expense' && category.toLowerCase() !== 'other') {
      const budget = await Budget.findOne({ userId: req.user._id, category });
      if (!budget) {
        const err = new Error(`Please set up a budget for "${category}" before adding expenses in it!`);
        err.statusCode = 400;
        return next(err);
      }
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      notes,
      date: date || Date.now()
    });

    if (type === 'expense') {
      await checkBudgetLimit(req.user._id, category);
    }

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// Get all transactions
const getTransactions = async (req, res, next) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      query = Transaction.find();
    } else {
      query = Transaction.find({ userId: req.user._id });
    }

    // Filters
    if (req.query.search) {
      query = query.find({ notes: { $regex: req.query.search, $options: 'i' } });
    }
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }
    if (req.query.type) {
      query = query.find({ type: req.query.type });
    }
    if (req.query.startDate || req.query.endDate) {
      const dateFilter = {};
      if (req.query.startDate) dateFilter.$gte = new Date(req.query.startDate);
      if (req.query.endDate) dateFilter.$lte = new Date(req.query.endDate);
      query = query.find({ date: dateFilter });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Transaction.countDocuments(query);
    const transactions = await query.skip(startIndex).limit(limit).sort('-date');

    res.json({
      success: true,
      count: transactions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Get single transaction by ID
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      const err = new Error('Transaction not found');
      err.statusCode = 404;
      return next(err);
    }

    if (transaction.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      const err = new Error('Not authorized to view this transaction');
      err.statusCode = 403;
      return next(err);
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// Update a transaction
const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      const err = new Error('Transaction not found');
      err.statusCode = 404;
      return next(err);
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to update this transaction');
      err.statusCode = 403;
      return next(err);
    }

    const targetType = req.body.type || transaction.type;
    const targetCategory = req.body.category || transaction.category;

    if (targetType === 'expense' && targetCategory.toLowerCase() !== 'other') {
      const budget = await Budget.findOne({ userId: req.user._id, category: targetCategory });
      if (!budget) {
        const err = new Error(`Please set up a budget for "${targetCategory}" before adding expenses in it!`);
        err.statusCode = 400;
        return next(err);
      }
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (transaction.type === 'expense') {
      await checkBudgetLimit(req.user._id, transaction.category);
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// Delete a transaction
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      const err = new Error('Transaction not found');
      err.statusCode = 404;
      return next(err);
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized to delete this transaction');
      err.statusCode = 403;
      return next(err);
    }

    await transaction.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
