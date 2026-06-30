const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// Get single user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Get all transactions across all users
const getAllTransactions = async (req, res, next) => {
  try {
    const filter = {};

    // Filters
    if (req.query.search) {
      filter.notes = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .skip(startIndex)
      .limit(limit)
      .sort('-date')
      .populate('userId', 'name email');

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

// Get Admin Stats
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    const incomeAgg = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const expenseAgg = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const budgetAgg = await Budget.aggregate([
      { $group: { _id: null, total: { $sum: '$limit' } } }
    ]);

    const topCategoriesAgg = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    const monthlyTrendsAgg = await Transaction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 6 }
    ]);

    const totalIncomeVolume = incomeAgg.length ? incomeAgg[0].total : 0;
    const totalExpenseVolume = expenseAgg.length ? expenseAgg[0].total : 0;
    const totalBudgetVolume = budgetAgg.length ? budgetAgg[0].total : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTransactions,
        totalIncomeVolume,
        totalExpenseVolume,
        totalBudgetVolume,
        topCategories: topCategoriesAgg,
        monthlyTrends: monthlyTrendsAgg
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update User Role
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    user.role = req.body.role || user.role;
    await user.save();
    
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Delete User (Cascading)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Cascade delete related records
    await Transaction.deleteMany({ userId: user._id });
    await Budget.deleteMany({ userId: user._id });
    await Category.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ success: true, message: 'User and all related data removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getAllTransactions,
  getAdminStats,
  updateUser,
  deleteUser
};
