// index.js - Main file for Express Backend API
const express = require('express');
const cors = require('cors'); // Corrected: require('cors')
const jwt = require('jsonwebtoken'); // Will be used for token generation/verification
const bcrypt = require('bcryptjs'); // Will be used for password hashing

const app = express();
const PORT = process.env.PORT || 3001; // Backend on a different port than potential frontend

// Middleware
app.use(cors()); // Corrected CORS usage
app.use(express.json()); // To parse JSON request bodies

// In-memory Database (Placeholder)
const db = {
  users: [],
  customers: [],
  leads: [],
  notes: [],
  tasks: []
};

// --- Routes ---
// Example: app.get('/api', (req, res) => res.json({ message: 'API Running' }));
app.get('/api', (req, res) => res.json({ message: 'API is alive!' })); // Added a live example route

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Customer Routes
const customerRoutes = require('./routes/customerRoutes');
app.use('/api/customers', customerRoutes);

// Lead Routes
const leadRoutes = require('./routes/leadRoutes');
app.use('/api/leads', leadRoutes);

// Note Routes
const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);

// Task Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);


// Basic Error Handler (very simple, can be expanded)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// Export db for use in route files (alternative to passing it around)
// This is a simple approach for in-memory. For real DBs, models would handle access.
module.exports.db = db;
