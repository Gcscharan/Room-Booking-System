const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res) => {
  try {
    const { capacity, location, amenities } = req.query;
    
    // Build query
    const query = {};
    
    // Add filters if provided
    if (capacity) query.capacity = { $gte: parseInt(capacity) };
    if (location) query.location = location;
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $in: amenitiesArray };
    }
    
    // Only return active rooms
    query.isActive = true;
    
    const rooms = await Room.find(query);
    
    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error in getRooms:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error in getRoomById:', error);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (would require auth middleware)
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error in createRoom:', error);
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (would require auth middleware)
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error in updateRoom:', error);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (would require auth middleware)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    await room.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteRoom:', error);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Check room availability
// @route   GET /api/rooms/:id/availability
// @access  Public
exports.checkRoomAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    // First check if room exists
    const room = await Room.findById(id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    // For now, return mock data since we don't have a Booking model yet
    // In a real implementation, we would query the Booking model to find
    // bookings for this room on the specified date
    
    const mockBookings = [];
    
    // Return the room with its availability
    res.json({
      success: true,
      data: {
        room,
        date,
        bookings: mockBookings
      }
    });
  } catch (error) {
    console.error('Error in checkRoomAvailability:', error);
    
    // Check if error is due to invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};