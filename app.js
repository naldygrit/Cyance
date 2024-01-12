// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/freelancers', freelancerRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Root route for status check
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Middleware for handling 404 - Not Found
app.use((req, res, next) => {
  res.status(404).send('404 - Not Found');
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
