// controllers/legalController.js

const User = require('../models/userModel');

const agreeToTerms = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.agreedToTerms = true;
        await user.save();

        res.status(200).json({ message: 'User agreed to terms successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording agreement to terms', error: error.message });
    }
};

const agreeToPrivacyPolicy = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.agreedToPrivacyPolicy = true;
        await user.save();

        res.status(200).json({ message: 'User agreed to privacy policy successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording agreement to privacy policy', error: error.message });
    }
};

const managePrivacySettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const { newPrivacySettings } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update privacy settings based on newPrivacySettings
        // Example: user.notificationPreferences = newPrivacySettings.notificationPreferences;
        // Implement other updates based on the provided settings

        await user.save();
        res.status(200).json({ message: 'Privacy settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating privacy settings', error: error.message });
    }
};

module.exports = {
    agreeToTerms,
    agreeToPrivacyPolicy,
    managePrivacySettings
};

