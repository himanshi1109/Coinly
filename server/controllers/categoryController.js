const Category = require('../models/Category');

// Get all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// Create a new category
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      const err = new Error('Category name is required');
      err.statusCode = 400;
      return next(err);
    }

    const category = await Category.create({
      name,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// Update a category
const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// Delete a category
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      return next(err);
    }

    await category.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
