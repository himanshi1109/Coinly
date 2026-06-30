const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

module.exports = router;
