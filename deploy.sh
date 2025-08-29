#!/bin/bash

# Room Booking System Deployment Script

echo "===== Room Booking System Deployment Helper ====="
echo "This script will help you deploy the application to Vercel."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Login to Vercel if needed
echo "Ensuring you're logged in to Vercel..."
vercel whoami || vercel login

# Deploy Backend
echo ""
echo "===== Deploying Backend ====="
cd backend

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "Error: vercel.json not found in backend directory."
    echo "Please make sure you've created the vercel.json file as described in VERCEL_DEPLOYMENT.md"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found in backend directory."
    echo "Creating .env from .env.example.env..."
    cp .env.example.env .env
    echo "Please update the .env file with your MongoDB Atlas connection string and other settings."
    echo "Press Enter to continue when ready..."
    read
fi

# Deploy backend
echo "Deploying backend to Vercel..."
vercel --prod

# Get backend URL
echo "What is the URL of your deployed backend? (e.g., https://room-booking-backend.vercel.app)"
read BACKEND_URL

# Deploy Frontend
echo ""
echo "===== Deploying Frontend ====="
cd ../frontend

# Create .env file for frontend
echo "Creating .env file for frontend with backend URL..."
echo "REACT_APP_BACKEND_URL=$BACKEND_URL" > .env

# Deploy frontend
echo "Deploying frontend to Vercel..."
vercel --prod

echo ""
echo "===== Deployment Complete ====="
echo "Your Room Booking System has been deployed to Vercel!"
echo "Please check the VERCEL_DEPLOYMENT.md file for troubleshooting if needed."