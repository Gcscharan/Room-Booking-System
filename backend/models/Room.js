const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a room name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add room capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  location: {
    type: String,
    required: [true, 'Please add room location'],
    trim: true
  },
  amenities: {
    type: [String],
    default: []
  },
  photo: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema);