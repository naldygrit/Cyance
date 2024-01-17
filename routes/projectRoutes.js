// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const roleMiddleware = require('../middleware/roleMiddleware');

// Middleware to determine user role and route accordingly
const routeBasedOnRole = (req, res, next) => {
  const { role } = req.user;

  switch (role) {
    case 'client':
      projectController.getClientProjects(req, res, next);
      break;
    case 'freelancer':
      projectController.getFreelancerProjects(req, res, next);
      break;
    default:
      res.status(403).json({ message: 'Forbidden' });
  }
};

// Create a new project (accessible to clients)
router.post('/create', roleMiddleware(['client']), projectController.createProject);

// Get projects (accessible to both clients and freelancers)
router.get('/projects', roleMiddleware(['client', 'freelancer']), projectController.getProjects);

// View details of a specific project (accessible to all authenticated users)
router.get('/view/:projectId', projectController.authMiddleware, projectController.viewProject);

// Update a project (accessible to clients)
router.put('/:projectId', roleMiddleware(['client']), projectController.updateProject);

// Delete a project (accessible to clients)
router.delete('/:projectId', roleMiddleware(['client']), projectController.deleteProject);

// Accept a proposal for a project (accessible to clients)
router.post('/acceptProposal/:projectId', roleMiddleware(['client']), projectController.acceptProposal);

// Reject a proposal for a project (accessible to clients)
router.post('/rejectProposal/:projectId', roleMiddleware(['client']), projectController.rejectProposal);

// Enable two-factor authentication for a client
// Assuming this feature is client-specific and not part of project management
router.post('/enable2FA', roleMiddleware(['client']), projectController.enable2FA);

// Verify two-factor authentication for a client
// Assuming this feature is client-specific and not part of project management
router.post('/verify2FA', roleMiddleware(['client']), projectController.verify2FA);

// Additional project-related routes...

module.exports = router;

