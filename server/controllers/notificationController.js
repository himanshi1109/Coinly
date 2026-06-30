const Notification = require('../models/Notification');

// Get all notifications for user
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort('-createdAt')
      .limit(50);
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// Delete a single notification
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      const err = new Error('Notification not found');
      err.statusCode = 404;
      return next(err);
    }
    if (notification.userId.toString() !== req.user._id.toString()) {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      return next(err);
    }
    await notification.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAllAsRead,
  deleteNotification
};
