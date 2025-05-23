// routes/userRoutes.js
const express = require('express');
const { db } = require('../index'); // Access the in-memory db
const { protectRoute } = require('../middleware/authMiddleware');
// const bcrypt = require('bcryptjs'); // Needed if allowing password updates

const router = express.Router();

// All routes in this file will be protected
router.use(protectRoute); 

// GET /api/users/me - Get current authenticated user's profile
router.get('/me', (req, res, next) => {
  try {
    // req.user is attached by protectRoute middleware and contains { userId, email, username }
    const currentUser = db.users.find(user => user.id === req.user.userId);

    if (!currentUser) {
      // This case should ideally not happen if token is valid and user exists
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = currentUser;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/me - Update current authenticated user's profile
router.put('/me', async (req, res, next) => {
  try {
    const { username, email /*, password */ } = req.body; // Add password if allowing updates
    const userId = req.user.userId;

    const userIndex = db.users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found for update.' });
    }

    // Update fields if provided
    if (username) db.users[userIndex].username = username;
    if (email) {
        // Check if new email is already taken by another user
        const emailExists = db.users.find(u => u.email === email && u.id !== userId);
        if (emailExists) {
            return res.status(409).json({ message: 'Email already in use by another account.' });
        }
        db.users[userIndex].email = email;
    }
    
    // If allowing password updates:
    // if (password) {
    //   if (password.length < 6) {
    //     return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    //   }
    //   const salt = await bcrypt.genSalt(10);
    //   db.users[userIndex].password = await bcrypt.hash(password, salt);
    // }
    
    db.users[userIndex].updatedAt = new Date().toISOString();

    const { password, ...updatedUserWithoutPassword } = db.users[userIndex];
    res.json({ message: 'Profile updated successfully.', user: updatedUserWithoutPassword });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/me - Delete current authenticated user's account
router.delete('/me', (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userIndex = db.users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found for deletion.' });
    }

    // Remove user from db
    db.users.splice(userIndex, 1);

    // In a real app, you might want to:
    // - Invalidate any active sessions/tokens more formally if using a blacklist.
    // - Handle cleanup of related data (e.g., if user created customers, leads etc.)

    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
