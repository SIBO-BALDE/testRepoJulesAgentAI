// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
// IMPORTANT: This secret should be consistent with the one used for signing tokens
// and ideally stored in environment variables.
const JWT_SECRET = 'your_super_secret_jwt_key_replace_this'; 

const protectRoute = (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGciOiJIUzI1Ni...")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user to request object (excluding sensitive info like password if it were there)
      // The payload from our login route includes: { userId, email, username }
      req.user = decoded; 

      next(); // Proceed to the protected route
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protectRoute };
