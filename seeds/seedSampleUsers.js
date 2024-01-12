// seeds/seedSampleUsers.js
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const seedSampleUsers = async () => {
  const sampleUsers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123', // Plain text password
      role: 'freelancer',
      skills: ['Penetration Testing', 'Incident Response'],
      clientType: null // Freelancers don't have a client type
    },
    {
      name: 'Lara Smith',
      email: 'lara@example.com',
      password: 'securepassword', // Plain text password
      role: 'client',
      skills: null, // Clients don't have skills
      clientType: 'individual'
    },
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'alicepassword', // Plain text password
      role: 'freelancer',
      skills: ['Web Security', 'Vulnerability Assessment'],
      clientType: null // Freelancers don't have a client type
    },
    {
      name: 'Bob Anderson',
      email: 'bob@example.com',
      password: 'bobpassword', // Plain text password
      role: 'freelancer',
      skills: ['Security Auditing', 'Security Consulting'],
      clientType: null // Freelancers don't have a client type
    },
    {
      name: 'Larnet',
      email: 'info@larnet.co.uk',
      password: 'larnetpassword', // Plain text password
      role: 'client',
      skills: null, // Clients don't have skills
      clientType: 'business'
    },
    {
      name: 'HMRC',
      email: 'info@hmrc.gov.uk',
      password: 'hmrcpassword12', // Plain text password
      role: 'client',
      skills: null, // Clients don't have skills
      clientType: 'government'
    }
    // Add more sample users as needed
  ]

  try {
    await mongoose.connect(process.env.MONGODB_URI) // Connect to MongoDB

    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      const newUser = new User({ ...user, password: hashedPassword, isPasswordHashed: true })
      await newUser.save()
    }
    console.log('Sample users added to the database')
  } catch (error) {
    console.error('Error adding sample users', error)
  } finally {
    await mongoose.disconnect() // Disconnect from MongoDB after seeding
  }
}

// Execute the seed function if this script is run directly
if (require.main === module) {
  seedSampleUsers().catch(console.error)
}

module.exports = seedSampleUsers
