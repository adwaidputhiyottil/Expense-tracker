// Import jsonwebtoken to verify tokens
const jwt = require('jsonwebtoken');
// Import the User model
const User = require('../models/User');

// Middleware to protect routes that require authentication
exports.protect = async (req, res, next) => {
    let token;

    // Check if the authorization header is present and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Extract the token from the header
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found, return a 401 (Unauthorized) error
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user associated with the token and attach it to the request object
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }

        // Update lastSeen without triggering full model validation/hooks
        await User.findByIdAndUpdate(decoded.id, { lastSeen: Date.now() });
        
        req.user = user;

        // Proceed to the next middleware or controller
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        // Return a 401 error if token verification fails
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};
