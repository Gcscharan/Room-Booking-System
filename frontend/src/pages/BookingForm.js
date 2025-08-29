import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import './Pages.css';

const BookingForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dateFromQuery = queryParams.get('date');
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: dateFromQuery || new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    purpose: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch room details on component mount
  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  // Fetch room details
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await api.get(`/api/rooms/${roomId}`);
      
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
          setError(`Room with ID ${roomId} could not be found. It may have been removed.`);
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors and success
    setBookingError(null);
    setBookingSuccess(false);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.startTime || !formData.endTime || !formData.purpose) {
      setBookingError('Please fill in all fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create booking
      const response = await api.post('/api/bookings', {
        ...formData,
        room: roomId
      });
      
      if (response.data.success) {
        setBookingSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '',
          endTime: '',
          purpose: ''
        });
        
        // Redirect to my bookings after 2 seconds
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } else {
        setBookingError('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setBookingError(error.response.data.error);
      } else {
        setBookingError('Error creating booking. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
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
    <div className="booking-form-container">
      <h1>Book a Room</h1>
      
      <div className="booking-form">
        {bookingSuccess ? (
          <div className="booking-success">
            <h2>Booking Successful!</h2>
            <p>Your booking has been confirmed. You will receive a confirmation email shortly.</p>
            <p>Redirecting to My Bookings...</p>
          </div>
        ) : (
          <>
            <div className="booking-summary">
              <h2>Booking Summary</h2>
              <div className="booking-summary-row">
                <span>Room:</span>
                <span>{room.name}</span>
              </div>
              <div className="booking-summary-row">
                <span>Location:</span>
                <span>{room.location}</span>
              </div>
              <div className="booking-summary-row">
                <span>Capacity:</span>
                <span>{room.capacity} people</span>
              </div>
            </div>
            
            {bookingError && (
              <div className="booking-error">
                {bookingError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-control" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-control" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="form-control" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    className="form-control" 
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <select 
                    id="startTime" 
                    name="startTime" 
                    className="form-control" 
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Start Time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <select 
                    id="endTime" 
                    name="endTime" 
                    className="form-control" 
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select End Time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="purpose">Purpose of Booking</label>
                <textarea 
                  id="purpose" 
                  name="purpose" 
                  className="form-control" 
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate(`/rooms/${roomId}`)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={submitting}
                >
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingForm;