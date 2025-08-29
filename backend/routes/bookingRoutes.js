const express = require('express');
const router = express.Router();

// Import controllers
const { 
  getBookings, 
  getBookingById, 
  createBooking, 
  updateBooking, 
  deleteBooking, 
  getUserBookings 
} = require('../controllers/bookingController');

// Define routes
// Get all bookings
router.get('/', getBookings);

// Get user bookings by email
router.get('/user/:email', getUserBookings);

// Get single booking
router.get('/:id', getBookingById);

// Create booking
router.post('/', createBooking);

// Update booking
router.put('/:id', updateBooking);

// Delete booking
router.delete('/:id', deleteBooking);

module.exports = router;