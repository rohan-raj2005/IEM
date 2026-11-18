const mongoose = require('mongoose');
const app = require('../backend/src/app');
const config = require('../backend/src/config/env');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000
    };

    cached.promise = mongoose.connect(config.MONGO_URI, opts).then((mongooseInstance) => {
      console.log('✅ Connected to MongoDB Atlas in serverless function');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('MongoDB Atlas Connection Error:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection failed: MongoDB Atlas rejected the connection. In MongoDB Atlas, go to "Network Access" and add IP "0.0.0.0/0" (Allow Access from Anywhere).'
    });
  }

  return app(req, res);
};
