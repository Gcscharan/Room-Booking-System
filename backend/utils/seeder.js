const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('../models/Room');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// Sample room data
const rooms = [
  {
    name: 'Conference Room A',
    description: 'Large conference room with modern amenities',
    capacity: 20,
    location: 'Floor 1',
    amenities: ['projector', 'whiteboard', 'videoConference', 'wifi'],
    photo: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Meeting Room B',
    description: 'Medium-sized meeting room ideal for team discussions',
    capacity: 10,
    location: 'Floor 2',
    amenities: ['whiteboard', 'wifi'],
    photo: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Boardroom',
    description: 'Executive boardroom with premium facilities',
    capacity: 15,
    location: 'Floor 3',
    amenities: ['projector', 'videoConference', 'wifi'],
    photo: 'https://images.unsplash.com/photo-1505409859467-3a796fd5798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Huddle Space',
    description: 'Small room for quick meetings and discussions',
    capacity: 5,
    location: 'East Wing',
    amenities: ['whiteboard', 'wifi'],
    photo: 'https://images.unsplash.com/photo-1416339134316-0e91dc9ded92?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Training Room',
    description: 'Large room equipped for training sessions and workshops',
    capacity: 30,
    location: 'West Wing',
    amenities: ['projector', 'whiteboard', 'wifi'],
    photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    name: 'Creative Space',
    description: 'Open area designed for brainstorming and creative work',
    capacity: 12,
    location: 'Floor 2',
    amenities: ['whiteboard', 'wifi'],
    photo: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await Room.deleteMany();
    
    // Insert new data
    await Room.insertMany(rooms);
    
    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Room.deleteMany();
    
    console.log('Data deleted successfully');
    process.exit();
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

// Determine which action to take based on command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to delete data');
  process.exit();
}