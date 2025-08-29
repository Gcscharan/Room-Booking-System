import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Pages.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    capacity: '',
    location: '',
    amenities: []
  });

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch rooms with filters
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      // Build query string from filters
      let queryString = '';
      if (filters.capacity) queryString += `capacity=${filters.capacity}&`;
      if (filters.location) queryString += `location=${filters.location}&`;
      if (filters.amenities.length > 0) queryString += `amenities=${filters.amenities.join(',')}&`;
      
      const response = await api.get(`/api/rooms?${queryString}`);
      
      if (response.data && response.data.success) {
        setRooms(response.data.data || []);
      } else {
        setError('Failed to fetch rooms: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      
      // Provide more specific error messages based on error type
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        if (error.response.status === 404) {
          setError('The rooms resource could not be found. Please try again later.');
        } else if (error.response.status === 500) {
          setError('The server encountered an error. Our team has been notified.');
        } else {
          setError(`Error fetching rooms: ${error.response.data?.message || error.message}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Cannot connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError(`Error fetching rooms: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Handle amenity filter changes
  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prevFilters => {
      if (checked) {
        return {
          ...prevFilters,
          amenities: [...prevFilters.amenities, value]
        };
      } else {
        return {
          ...prevFilters,
          amenities: prevFilters.amenities.filter(amenity => amenity !== value)
        };
      }
    });
  };

  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      capacity: '',
      location: '',
      amenities: []
    });
    // Reset checkboxes
    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
    fetchRooms();
  };

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h1>Available Rooms</h1>
      </div>
      
      <div className="filters">
        <form onSubmit={applyFilters}>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="capacity">Minimum Capacity</label>
              <select 
                id="capacity" 
                name="capacity" 
                className="form-control" 
                value={filters.capacity}
                onChange={handleFilterChange}
              >
                <option value="">Any Capacity</option>
                <option value="2">2+ People</option>
                <option value="5">5+ People</option>
                <option value="10">10+ People</option>
                <option value="20">20+ People</option>
                <option value="50">50+ People</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select 
                id="location" 
                name="location" 
                className="form-control"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">Any Location</option>
                <option value="Floor 1">Floor 1</option>
                <option value="Floor 2">Floor 2</option>
                <option value="Floor 3">Floor 3</option>
                <option value="East Wing">East Wing</option>
                <option value="West Wing">West Wing</option>
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>Amenities</label>
              <div className="checkbox-group">
                <div>
                  <input 
                    type="checkbox" 
                    id="projector" 
                    name="amenities" 
                    value="projector"
                    onChange={handleAmenityChange}
                  />
                  <label htmlFor="projector">Projector</label>
                </div>
                
                <div>
                  <input 
                    type="checkbox" 
                    id="whiteboard" 
                    name="amenities" 
                    value="whiteboard"
                    onChange={handleAmenityChange}
                  />
                  <label htmlFor="whiteboard">Whiteboard</label>
                </div>
                
                <div>
                  <input 
                    type="checkbox" 
                    id="videoConference" 
                    name="amenities" 
                    value="videoConference"
                    onChange={handleAmenityChange}
                  />
                  <label htmlFor="videoConference">Video Conference</label>
                </div>
                
                <div>
                  <input 
                    type="checkbox" 
                    id="wifi" 
                    name="amenities" 
                    value="wifi"
                    onChange={handleAmenityChange}
                  />
                  <label htmlFor="wifi">WiFi</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="filter-actions">
            <button type="submit" className="btn btn-primary">Apply Filters</button>
            <button type="button" className="btn btn-secondary" onClick={resetFilters}>Reset</button>
          </div>
        </form>
      </div>
      
      {loading ? (
        <div className="loading">Loading rooms...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="rooms-grid">
          {rooms.length > 0 ? (
            rooms.map(room => (
              <div key={room._id} className="room-card">
                <div className="room-image">
                  <img 
                    src={room.photo || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                    alt={room.name} 
                  />
                </div>
                
                <div className="room-details">
                  <h3 className="room-name">{room.name}</h3>
                  
                  <div className="room-info">
                    <div className="room-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {room.location}
                    </div>
                    
                    <div className="room-capacity">
                      <i className="fas fa-users"></i>
                      {room.capacity} people
                    </div>
                  </div>
                  
                  <div className="room-amenities">
                    {room.amenities && room.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                  
                  <div className="room-actions">
                    <Link to={`/rooms/${room._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    
                    <Link to={`/book/${room._id}`} className="btn btn-secondary">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-rooms">
              <p>No rooms found matching your criteria.</p>
              <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rooms;