// controllers/legalController.js
const User = require('../models/userModel');

// Record user's agreement to Terms of Service
const agreeToTerms = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.agreedToTerms = true;
        user.agreedToTermsOn = new Date();
        await user.save();

        res.status(200).json({ message: 'Agreement to Terms of Service recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording agreement to Terms of Service', error: error.message });
    }
};

// Record user's agreement to the Privacy Policy
const agreeToPrivacyPolicy = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.agreedToPrivacyPolicy = true;
        user.agreedToPrivacyPolicyOn = new Date();
        await user.save();

        res.status(200).json({ message: 'Agreement to Privacy Policy recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording agreement to Privacy Policy', error: error.message });
    }
};

// Manage user's privacy settings
const managePrivacySettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const newPrivacySettings = req.body; // Should contain structured data for privacy settings
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update privacy settings
        user.privacySettings = { ...user.privacySettings, ...newPrivacySettings };
        await user.save();

        res.status(200).json({ message: 'Privacy settings updated successfully', privacySettings: user.privacySettings });
    } catch (error) {
        res.status(500).json({ message: 'Error updating privacy settings', error: error.message });
    }
};

module.exports = {
    agreeToTerms,
    agreeToPrivacyPolicy,
    managePrivacySettings
};

