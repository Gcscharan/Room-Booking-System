import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-calendar-check"></i>
          <span>Room Booking System</span>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/rooms" className="nav-link">
              Rooms
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/my-bookings" className="nav-link">
              My Bookings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;