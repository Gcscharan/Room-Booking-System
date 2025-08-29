const express = require('express');
const router = express.Router();

// Import controllers
const { 
  getRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom, 
  checkRoomAvailability 
} = require('../controllers/roomController');

// Define routes
// Get all rooms
router.get('/', getRooms);

// Get single room
router.get('/:id', getRoomById);

// Create room
router.post('/', createRoom);

// Update room
router.put('/:id', updateRoom);

// Delete room
router.delete('/:id', deleteRoom);

// Check room availability
router.get('/:id/availability', checkRoomAvailability);

module.exports = router;