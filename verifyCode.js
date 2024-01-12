const fs = require('fs');

const checkFile = (filePath) => {
  console.log(`Checking file: ${filePath}`);
  const code = fs.readFileSync(filePath, 'utf-8');

  // Skip .env file entirely
  if (filePath === './.env') {
    return;
  }

  // Skip require check for errorMiddleware.js and server.js
  if (filePath === './middleware/errorMiddleware.js' || filePath === './server.js') {
    if (!code.includes('module.exports')) {
      console.error(`Error: No 'module.exports' found in ${filePath}`);
    }
    return;
  }

  // General checks for other files
  if (!code.includes('require')) {
    console.error(`Error: No 'require' statements found in ${filePath}`);
  }
  if (!code.includes('module.exports')) {
    console.error(`Error: No 'module.exports' found in ${filePath}`);
  }

  console.log('File check complete.\n');
};

// List of files to check
const filesToCheck = [
  './app.js',
  './server.js',
  './config/dbConfig.js',
  './routes/userRoutes.js',
  './routes/freelancerRoutes.js',
  './routes/clientRoutes.js',
  './routes/adminRoutes.js',
  './models/projectModel.js',
  './models/reviewModel.js',
  './models/userModel.js',
  './controllers/reviewController.js',
  './controllers/messageController.js',
  './controllers/clientController.js',
  './controllers/adminController.js',
  './controllers/freelancerController.js',
  './controllers/userController.js',
  './controllers/projectController.js',
  './controllers/legalController.js',
  './seeds/seedSampleUsers.js',
  './seeds/seedUsers.js',
  './utils/paymentGateway.js',
  './utils/tokenUtils.js',
  './middleware/errorMiddleware.js',
  './middleware/authMiddleware.js',
  './middleware/roleMiddleware.js',
  './routes/projectRoutes.js',
  './routes/reviewRoutes.js',
  './routes/messageRoutes.js',
  './routes/clientRoutes.js',
  './routes/adminRoutes.js',
  './routes/legalRoutes.js',
  './controllers/dashboardController.js',
  './routes/dashboardRoutes.js',
  './config/jwt-config.js'
];

// Perform the file checks
filesToCheck.forEach(checkFile);