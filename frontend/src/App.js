import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Chatbot from './components/Chatbot/Chatbot';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/book/:roomId" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}

export default App;