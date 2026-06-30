const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// Register a new user
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const err = new Error('User already exists');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      const err = new Error('Invalid user data');
      err.statusCode = 400;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// Get current logged in user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || "",
          status: user.status || "active"
        }
      });
    } else {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// Update user profile details
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    const { name, email, phone, status } = req.body;

    if (name) user.name = name;
    if (email) {
      if (email.toLowerCase() !== user.email.toLowerCase()) {
        const emailTaken = await User.findOne({ email: email.toLowerCase() });
        if (emailTaken) {
          const err = new Error('Email is already in use by another account');
          err.statusCode = 400;
          return next(err);
        }
        user.email = email.toLowerCase();
      }
    }
    if (phone !== undefined) user.phone = phone;
    if (status !== undefined) user.status = status;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        status: user.status || "active"
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
