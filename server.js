// server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/dbConfig');

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
