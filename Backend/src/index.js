import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

// Load environment variables FIRST before any other imports that depend on them
dotenv.config();

import ConnectDB from './database/ConnectDB.js';
import authRoutes from './routes/auth.routes.js';
import reviewRoutes from './routes/review.routes.js';
import repoRoutes from './routes/repo.routes.js';
import './controllers/auth.controller.js'; // Initialize passport strategies

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
ConnectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/repo', repoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Warn about missing environment variables
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  Gemini API key not found. Code review features will not work.');
    console.warn('   Please set GEMINI_API_KEY in your .env file.');
  }
  
  if (!process.env.MONGO_URI) {
    console.warn('⚠️  MongoDB URI not found. Database features will not work.');
    console.warn('   Please set MONGO_URI in your .env file.');
  }
});

