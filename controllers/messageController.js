const Message = require('../models/messageModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');

// Function to send a message
const sendMessage = async (req, res) => {
  try {
    const { projectId, content, receiver } = req.body;

    // Validate the receiver and check project status
    const [isValidReceiver, project] = await Promise.all([
      User.exists({ _id: receiver }),
      Project.findById(projectId)
    ]);

    if (!isValidReceiver) {
      return res.status(400).json({ message: 'Invalid receiver' });
    }

    if (project && project.status === 'completed') {
      return res.status(403).json({ message: 'Messaging for this project is now closed.' });
    }

    const newMessage = new Message({
      project: projectId,
      content,
      sender: req.user._id,
      receiver
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Function to get messages
const getMessages = async (req, res) => {
  try {
    const { projectId } = req.query;

    // Retrieve messages linked to a specific project
    const messages = await Message.find({ project: projectId })
                                  .sort({ timestamp: 1 })
                                  .populate('sender receiver', 'name');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages
};