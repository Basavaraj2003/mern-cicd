
# Code Analyzer Server

This is the backend server for the Code Analyzer application.

## Setup

1. Install server dependencies:
   ```
   npm install
   ```

2. Set up your MongoDB connection:
   - Create a `.env` file in the server directory
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```
   - If not provided, it will default to `mongodb://localhost:27017/code-analyzer`

3. Start the server:
   - For production: `npm start`
   - For development (with auto-restart): `npm run dev`

## API Endpoints

- `GET /api/analyses` - Get all analyses
- `GET /api/analyses/:id` - Get a specific analysis by ID
- `POST /api/analyses` - Save a new analysis

## Environment Variables

- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string
