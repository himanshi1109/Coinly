const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// Create a new transaction
const createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { type, amount, category, notes, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      notes,
      date: date || Date.now()
    });

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

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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
