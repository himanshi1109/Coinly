require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Clear existing users and categories
    await User.deleteMany();
    await Category.deleteMany();
    console.log('Cleared existing users and categories');

    // 3. Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@coinly.com',
      password: 'Admin123@',
      role: 'admin'
    });
    console.log('Created admin user');

    // 4. Create 8 default categories
    const defaultCategories = [
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Entertainment',
      'Health',
      'Education',
      'Other'
    ];

    const categoryDocs = defaultCategories.map(name => ({
      name,
      createdBy: adminUser._id
    }));

    await Category.insertMany(categoryDocs);
    console.log('Created 8 default categories');

    console.log('Database seeded successfully!');
    
    // 6. Disconnect from MongoDB when done
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error with seed data: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
