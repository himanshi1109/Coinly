const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  getAllTransactions,
  getAdminStats,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/users', protect, adminOnly, getUsers);
router.get('/users/:id', protect, adminOnly, getUserById);
router.put('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.get('/transactions', protect, adminOnly, getAllTransactions);

module.exports = router;
