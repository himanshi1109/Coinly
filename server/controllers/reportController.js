const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Get reports data
const getReports = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Expense By Category
    const expenseByCategory = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    // Monthly Trends (Income and Expense per month)
    const monthlyTrends = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$date' }
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
            }
          }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 6 }
    ]);

    res.json({
      success: true,
      data: {
        expenseByCategory,
        monthlyTrends
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReports };
