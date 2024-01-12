const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Route for sending a message - Available to both clients and freelancers
router.post('/send', roleMiddleware(['client', 'freelancer']), messageController.sendMessage);

// Route for retrieving messages - Available to both clients and freelancers
router.get('/', roleMiddleware(['client', 'freelancer']), messageController.getMessages);

// Route for fetching a specific message and marking it as read if opened by the recipient
router.get('/:messageId', roleMiddleware(['client', 'freelancer']), async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await messageController.getMessageAndMarkAsRead(messageId, req.user._id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving message', error: error.message });
    }
});

// Route for deleting a message - Users can only delete their own messages
router.delete('/:messageId', roleMiddleware(['client', 'freelancer']), messageController.deleteMessage);

module.exports = router;
