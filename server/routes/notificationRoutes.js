const express = require('express');
const router = express.Router();
const { getNotifications, markAllAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/read', protect, markAllAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
