const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Function to create sample bookings
const seedBookings = async () => {
  try {
    // Clear existing bookings
    await Booking.deleteMany();
    console.log('Existing bookings cleared');

    // Get all rooms to reference in bookings
    const rooms = await Room.find();
    
    if (rooms.length === 0) {
      console.log('No rooms found. Please run the room seeder first.');
      process.exit(1);
    }

    // Sample booking data
    const bookings = [
      {
        name: 'John Doe',
        email: 'gcs.charan@gmail.com', // Using the email provided by the user
        phone: '123-456-7890',
        date: new Date(Date.now() + 86400000), // Tomorrow
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        purpose: 'Team meeting',
        status: 'Confirmed',
        room: rooms[0]._id
      },
      {
        name: 'Jane Smith',
        email: 'gcs.charan@gmail.com', // Using the email provided by the user
        phone: '987-654-3210',
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        startTime: '2:00 PM',
        endTime: '3:00 PM',
        purpose: 'Client presentation',
        status: 'Confirmed',
        room: rooms[1]._id
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '555-123-4567',
        date: new Date(Date.now() + 259200000), // 3 days from now
        startTime: '9:00 AM',
        endTime: '10:30 AM',
        purpose: 'Project planning',
        status: 'Confirmed',
        room: rooms[2]._id
      }
    ];

    // Insert bookings
    await Booking.insertMany(bookings);

    console.log('Sample bookings inserted successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding bookings:', error);
    process.exit(1);
  }
};

// Run the seeder
seedBookings();