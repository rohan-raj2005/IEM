const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected to: ${config.MONGO_URI}`);
    return true;
  } catch (err) {
    console.warn(`⚠️ MongoDB connection error (${err.message}).`);
    return false;
  }
};

module.exports = { connectDB };
