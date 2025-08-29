# Room Booking System with ML-powered Chatbot

A modern room booking system built with the MERN stack (MongoDB, Express.js, React, Node.js) and featuring a machine learning-powered chatbot for intelligent assistance.

## Features

- **User-friendly Interface**: Intuitive UI for browsing and booking rooms
- **Room Management**: View room details, capacity, amenities, and availability
- **Booking System**: Book rooms with date and time selection
- **My Bookings**: View and manage your bookings
- **Email Notifications**: Receive booking confirmations via email
- **ML-powered Chatbot**: Get assistance with natural language processing
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js & Express.js**: Server and API
- **MongoDB & Mongoose**: Database and ODM
- **Natural**: Natural language processing for the chatbot
- **Nodemailer**: Email notifications

### Frontend
- **React**: UI library
- **React Router**: Navigation
- **Axios**: API requests
- **CSS3**: Styling

## Project Structure

```
Room-Booking-System/
├── backend/               # Backend code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── frontend/             # Frontend code
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── context/      # React context
│       └── utils/        # Utility functions
└── ml-model/             # Machine learning model for chatbot
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI and email settings.

5. Start the backend server:
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room
- `GET /api/rooms/:id/availability` - Check room availability

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get a specific booking
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Cancel a booking
- `GET /api/bookings/user/:email` - Get bookings by user email

### Chatbot
- `POST /api/chatbot/message` - Send a message to the chatbot
- `GET /api/chatbot/history/:sessionId` - Get chat history

## ML Chatbot

The chatbot uses natural language processing to understand user intent and provide assistance with room booking. It can help with:

- Finding available rooms
- Booking a room
- Checking booking status
- Cancelling bookings
- Answering general questions

## License

MIT