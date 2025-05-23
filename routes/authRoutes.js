// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../index'); // Access the in-memory db

const router = express.Router();
const JWT_SECRET = 'your_super_secret_jwt_key_replace_this'; // IMPORTANT: Replace and use env var in production

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Basic validation
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existingUser = db.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and store new user
    const newUser = {
      id: `user-${Date.now().toString()}`, // Simple ID generation
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);

    // Don't send password back, even hashed
    const userResponse = { ...newUser };
    delete userResponse.password;

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = db.users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found).' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch).' });
    }

    // User matched, create JWT
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username
      // Add other relevant, non-sensitive info if needed
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    res.json({ 
      message: 'Login successful', 
      token,
      user: { // Send back some user info, excluding password
        id: user.id,
        username: user.username,
        email: user.email
      } 
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout (Optional - mostly client-side for JWT)
router.post('/logout', (req, res) => {
    // For JWT, logout is primarily handled client-side by deleting the token.
    // If you had server-side session management or token blacklisting, you'd handle it here.
    res.json({ message: 'Logout successful. Please clear your token on the client-side.' });
});


module.exports = router;
