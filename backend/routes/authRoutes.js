// Import express
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import auth controllers
const { register, login, getMe, updatePassword } = require('../controllers/authController');
// Import protection middleware
const { protect } = require('../middleware/authMiddleware');

// Define register route
router.post('/register', register);
// Define login route
router.post('/login', login);
// Define 'me' route (protected)
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

// Export the router
module.exports = router;
