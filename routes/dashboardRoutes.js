// routes/dashboardRoutes.js

const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')

router.get('/user', dashboardController.getUserDashboard)

module.exports = router
