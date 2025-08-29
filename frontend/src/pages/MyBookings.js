import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Pages.css';

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await api.get(`/api/bookings/user/${email}`);
      
      if (response.data && response.data.success) {
        setBookings(response.data.data || []);
        setSuccess(true);
        
        // Save email to localStorage for future use
        localStorage.setItem('bookingEmail', email);
      } else {
        setError('Failed to fetch bookings: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
      // Provide more specific error messages based on error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        if (error.response.status === 404) {
          setError('No bookings found for this email address.');
          setBookings([]);
          setSuccess(true); // Still consider this a success, just with empty results
        } else if (error.response.status === 500) {
          setError('The server encountered an error. Our team has been notified.');
        } else {
          setError(`Error fetching bookings: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Cannot connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError(`Error fetching bookings: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      setCancellingId(bookingId);
      setCancelError(null);
      setCancelSuccess(null);
      
      const response = await api.delete(`/api/bookings/${bookingId}`);
      
      if (response.data.success) {
        // Remove the cancelled booking from the list
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
        setCancelSuccess('Booking cancelled successfully');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setCancelSuccess(null);
        }, 3000);
      } else {
        setCancelError('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setCancelError('Error cancelling booking. Please try again later.');
    } finally {
      setCancellingId(null);
    }
  };

  // Check for saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('bookingEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      // Auto-fetch bookings if email is available
      const fetchSavedBookings = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get(`/api/bookings/user/${savedEmail}`);
          
          if (response.data && response.data.success) {
            setBookings(response.data.data || []);
            setSuccess(true);
          } else {
            setBookings([]);
            setError('Failed to fetch bookings: ' + (response.data?.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error fetching saved bookings:', error);
          setBookings([]);
          
          // Provide more specific error messages based on error type
          if (error.response) {
            // The request was made and the server responded with a status code outside of 2xx
            if (error.response.status === 404) {
              setError('No bookings found for this email address.');
              setSuccess(true); // Still consider this a success, just with empty results
            } else if (error.response.status === 500) {
              setError('The server encountered an error. Our team has been notified.');
            } else {
              setError(`Error fetching bookings: ${error.response.data?.message || error.message}`);
            }
          } else if (error.request) {
            // The request was made but no response was received
            setError('Cannot connect to the server. Please check your internet connection.');
          } else {
            // Something happened in setting up the request
            setError(`Error fetching bookings: ${error.message}`);
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchSavedBookings();
    }
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if booking is in the past
  const isPastBooking = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate < today;
  };

  return (
    <div className="my-bookings-container">
      <h1>My Bookings</h1>
      
      <div className="email-search-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Enter your email to view your bookings</label>
            <div className="email-input-group">
              <input 
                type="email" 
                id="email" 
                className="form-control" 
                value={email}
                onChange={handleEmailChange}
                placeholder="your.email@example.com"
                required
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Find Bookings'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {error && <div className="error">{error}</div>}
      {cancelError && <div className="error">{cancelError}</div>}
      {cancelSuccess && <div className="success">{cancelSuccess}</div>}
      
      {success && (
        <div className="bookings-list">
          {!bookings || bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found for this email address.</p>
              <Link to="/rooms" className="btn btn-primary">Book a Room</Link>
            </div>
          ) : (
            <>
              <h2>Your Bookings</h2>
              <div className="bookings-grid">
                {bookings.map(booking => {
                  const isPast = isPastBooking(booking.date);
                  
                  return (
                    <div 
                      key={booking._id} 
                      className={`booking-card ${isPast ? 'past-booking' : ''}`}
                    >
                      <div className="booking-header">
                        <h3>{booking.room.name}</h3>
                        <span className={`booking-status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="booking-details">
                        <div className="booking-detail">
                          <span className="detail-label">Date:</span>
                          <span className="detail-value">{formatDate(booking.date)}</span>
                        </div>
                        
                        <div className="booking-detail">
                          <span className="detail-label">Time:</span>
                          <span className="detail-value">{booking.startTime} - {booking.endTime}</span>
                        </div>
                        
                        <div className="booking-detail">
                          <span className="detail-label">Location:</span>
                          <span className="detail-value">{booking.room.location}</span>
                        </div>
                        
                        <div className="booking-detail">
                          <span className="detail-label">Purpose:</span>
                          <span className="detail-value">{booking.purpose}</span>
                        </div>
                      </div>
                      
                      <div className="booking-actions">
                        <Link 
                          to={`/rooms/${booking.room._id}`} 
                          className="btn btn-secondary btn-sm"
                        >
                          View Room
                        </Link>
                        
                        {!isPast && booking.status !== 'Cancelled' && (
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                          >
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;