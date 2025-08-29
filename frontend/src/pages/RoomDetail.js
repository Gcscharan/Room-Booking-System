import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import './Pages.css';

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState([]);

  // Fetch room details on component mount
  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  // Fetch room availability when date changes
  useEffect(() => {
    if (room) {
      fetchRoomAvailability();
    }
  }, [selectedDate, room]);

  // Fetch room details
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await api.get(`/api/rooms/${id}`);
      
      if (response.data && response.data.success) {
        setRoom(response.data.data);
      } else {
        setError('Failed to fetch room details: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      
      // Provide more specific error messages based on error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        if (error.response.status === 404) {
          setError(`Room with ID ${id} could not be found. It may have been removed.`);
        } else if (error.response.status === 500) {
          setError('The server encountered an error. Our team has been notified.');
        } else {
          setError(`Error fetching room details: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Cannot connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError(`Error fetching room details: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch room availability
  const fetchRoomAvailability = async () => {
    try {
      const response = await api.get(`/api/rooms/${id}/availability?date=${selectedDate}`);
      
      if (response.data.success) {
        setBookings(response.data.data.bookings);
      } else {
        console.error('Failed to fetch room availability');
      }
    } catch (error) {
      console.error('Error fetching room availability:', error);
    }
  };

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Check if time slot is available
  const isTimeSlotAvailable = (startTime) => {
    if (!bookings || bookings.length === 0) return true;
    
    return !bookings.some(booking => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      
      // Convert to 24-hour format for comparison
      const convertTo24Hour = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (hours === '12') {
          hours = '00';
        }
        
        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12;
        }
        
        return `${hours}:${minutes}`;
      };
      
      const start = convertTo24Hour(startTime);
      const bookStart = convertTo24Hour(bookingStart);
      const bookEnd = convertTo24Hour(bookingEnd);
      
      return start >= bookStart && start < bookEnd;
    });
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const hourFormatted = hour > 12 ? hour - 12 : hour;
      const amPm = hour >= 12 ? 'PM' : 'AM';
      const timeSlot = `${hourFormatted}:00 ${amPm}`;
      
      slots.push({
        time: timeSlot,
        available: isTimeSlotAvailable(timeSlot)
      });
    }
    
    return slots;
  };

  if (loading) {
    return <div className="loading">Loading room details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!room) {
    return <div className="error">Room not found</div>;
  }

  return (
    <div className="room-detail-container">
      <div className="room-detail-header">
        <h1>{room.name}</h1>
        <Link to="/rooms" className="btn btn-secondary">
          Back to Rooms
        </Link>
      </div>
      
      <div className="room-detail-content">
        <div className="room-detail-main">
          <div className="room-detail-image">
            <img 
              src={room.photo || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
              alt={room.name} 
            />
          </div>
          
          <div className="room-detail-info">
            <div className="room-info-section">
              <h2>Room Details</h2>
              <p>{room.description || 'No description available.'}</p>
              
              <div className="room-specs">
                <div className="room-spec">
                  <i className="fas fa-users"></i>
                  <span>Capacity: {room.capacity} people</span>
                </div>
                
                <div className="room-spec">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Location: {room.location}</span>
                </div>
              </div>
            </div>
            
            <div className="room-info-section">
              <h2>Amenities</h2>
              <div className="room-amenities-list">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity, index) => (
                    <div key={index} className="room-amenity">
                      <i className="fas fa-check"></i>
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p>No amenities listed</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="room-detail-sidebar">
          <h2>Book This Room</h2>
          
          <div className="availability-calendar">
            <div className="form-group">
              <label htmlFor="date">Select Date</label>
              <input 
                type="date" 
                id="date" 
                className="form-control" 
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <h3>Available Time Slots</h3>
            <div className="time-slots">
              {generateTimeSlots().map((slot, index) => (
                <div 
                  key={index} 
                  className={`time-slot ${slot.available ? 'available' : 'unavailable'}`}
                >
                  <span>{slot.time}</span>
                  <span>{slot.available ? 'Available' : 'Booked'}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Link to={`/book/${room._id}?date=${selectedDate}`} className="btn btn-primary btn-block">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;