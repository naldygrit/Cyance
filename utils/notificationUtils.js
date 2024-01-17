// utils/notificationUtils.js
const Notification = require('../models/notificationModel');

const sendNotification = async (userId, message) => {
    const notification = new Notification({ userId, message });
    await notification.save();
};
module.exports = sendNotification;
