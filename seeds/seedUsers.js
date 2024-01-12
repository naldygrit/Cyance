// seeds/seedUsers.js
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    seedSampleUsers() // Call the function to seed sample users after connecting
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err)
    process.exit(1) // Exit with an error code
  })

// Function to add sample users to the database
const seedSampleUsers = async () => {
  const sampleUsers = [
    // ... (unchanged)
  ]

  try {
    // Clear existing users
    await User.deleteMany({})

    // Use 'insertMany' for efficient bulk insertion of sample users
    await User.insertMany(sampleUsers)
    console.log('Bulk of sample users added to the database')

    // Individual inserts for special users
    const individualInserts = sampleUsers.map(async user => {
      const newUser = new User(user)
      await newUser.save()
    })

    // Wait for all individual inserts to complete
    await Promise.all(individualInserts)

    console.log('Sample users added to the database')
  } catch (error) {
    console.error('Error adding sample users', error)
  } finally {
    await mongoose.disconnect() // Close the database connection when seeding is done
    process.exit(0) // Exit with a success code
  }
}

// Execute the seed function if this script is run directly
if (require.main === module) {
  seedSampleUsers().catch(console.error)
}

module.exports = seedSampleUsers
