import React from 'react';
import { Link } from 'react-router-dom';
import './Pages.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Room Booking System</h1>
          <p>Find and book the perfect room for your meetings, conferences, and events</p>
          <Link to="/rooms" className="btn btn-primary btn-lg">
            Browse Rooms
          </Link>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Why Choose Our Room Booking System?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Easy Search</h3>
            <p>Find available rooms based on capacity, location, and amenities</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3>Simple Booking</h3>
            <p>Book rooms in just a few clicks with our intuitive interface</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-robot"></i>
            </div>
            <h3>AI Assistant</h3>
            <p>Get help from our ML-powered chatbot for quick responses</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-bell"></i>
            </div>
            <h3>Notifications</h3>
            <p>Receive email confirmations and reminders for your bookings</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Search</h3>
            <p>Browse available rooms or use filters to find the perfect match</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Select</h3>
            <p>Choose a room and select your preferred date and time</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Book</h3>
            <p>Fill in your details and confirm your booking</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Confirm</h3>
            <p>Receive confirmation and access details via email</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to book a room?</h2>
          <p>Start browsing available rooms or ask our chatbot for assistance</p>
          <div className="cta-buttons">
            <Link to="/rooms" className="btn btn-primary">
              Browse Rooms
            </Link>
            <button className="btn btn-secondary" onClick={() => document.querySelector('.chatbot-input input').focus()}>
              Chat with Assistant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;