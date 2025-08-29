# Deploying Room Booking System to Vercel

This guide will walk you through deploying both the frontend and backend of the Room Booking System to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) for the database
3. Git repository for your project (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your MongoDB Atlas Database

1. Create a MongoDB Atlas cluster if you don't have one already
2. Configure network access to allow connections from anywhere (for Vercel)
3. Create a database user with read/write permissions
4. Get your MongoDB connection string

## Step 2: Deploy the Backend

1. Log in to your Vercel account
2. Click on "Add New..." and select "Project"
3. Import your Git repository (backend folder)
4. Configure the project:
   - Set the name (e.g., "room-booking-backend")
   - Set the root directory to the backend folder
   - Set the build command to `npm install`
   - Set the output directory to `.`
   - Set the development command to `npm run dev`
5. Add environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `EMAIL_USER`: Your email for notifications
   - `EMAIL_PASS`: Your email password or app password
   - `JWT_SECRET`: A secure random string for JWT tokens
6. Click "Deploy"
7. Once deployed, note the URL of your backend (e.g., `https://room-booking-backend.vercel.app`)

## Step 3: Deploy the Frontend

1. Go back to the Vercel dashboard
2. Click on "Add New..." and select "Project"
3. Import your Git repository (frontend folder)
4. Configure the project:
   - Set the name (e.g., "room-booking-frontend")
   - Set the root directory to the frontend folder
   - Framework preset should be automatically detected as "Create React App"
5. Add environment variables:
   - `REACT_APP_BACKEND_URL`: The URL of your deployed backend from Step 2
6. Click "Deploy"

## Step 4: Test Your Deployment

1. Once both deployments are complete, open your frontend URL in a browser
2. Test all functionality to ensure it's working correctly
3. Check that the frontend can communicate with the backend

## Troubleshooting

### CORS Issues

If you encounter CORS errors, update the CORS configuration in your backend's `server.js` file to include your frontend's domain:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

Then redeploy your backend.

### Environment Variables

If your application isn't connecting to the backend, check that you've set the `REACT_APP_BACKEND_URL` environment variable correctly in the Vercel frontend project settings.

### Database Connection

If your backend can't connect to MongoDB, verify that:
1. Your MongoDB Atlas connection string is correct
2. Network access is configured to allow connections from anywhere
3. The database user has the correct permissions

## Continuous Deployment

Vercel automatically redeploys your application when you push changes to your Git repository. To update your application:

1. Make changes to your code
2. Commit and push to your Git repository
3. Vercel will automatically detect the changes and redeploy

## Custom Domain

To use a custom domain with your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Domains"
3. Add your custom domain and follow the instructions to configure DNS settings