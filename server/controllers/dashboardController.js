const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Get dashboard data
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregate totals
    const totals = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    totals.forEach(t => {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpenses = t.total;
    });

    const balance = totalIncome - totalExpenses;

    // Current month expenses
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const currentMonthExpensesAgg = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const currentMonthExpenses = currentMonthExpensesAgg.length > 0 ? currentMonthExpensesAgg[0].total : 0;

    // Recent transactions
    const recentTransactions = await Transaction.find({ userId })
      .sort('-date')
      .limit(5);

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
        currentMonthExpenses,
        recentTransactions
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData };
