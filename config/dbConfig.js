// config/dbConfig.js
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw new Error('Unable to connect to the database');
  }
};

module.exports = connectToDatabase;
