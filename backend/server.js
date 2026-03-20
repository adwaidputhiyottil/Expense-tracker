// IMPORTANT: Load environment variables FIRST before any other imports
// so that process.env values are available everywhere (JWT_SECRET, MONGO_URI, etc.)
import cors from "cors";

app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    credentials: true,
  }),
);

const dotenv = require('dotenv');
dotenv.config();

// Now safe to import modules that need env vars
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

// Import route files explicitly (cleaner than inline require inside app.use)
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Connect to MongoDB (MONGO_URI is now loaded from .env)
connectDB().then(() => {
    // Seed admin user
    const seedAdmin = require('./utils/seedAdmin');
    seedAdmin();
});

// Initialize the Express application
const app = express();

// --- Global Middleware ---
// Parse incoming JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing for the frontend
app.use(cors());

// Request logger — logs every incoming request method and URL
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const adminRoutes = require('./routes/adminRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// --- Routes ---
// Public auth routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/auth', authRoutes);

// Protected expense routes — all require a valid JWT via the protect middleware
app.use('/api/expenses', protect, expenseRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Analysis routes
app.use('/api/analysis', analysisRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- 404 Handler (must be after all routes) ---
app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ success: false, error: 'Route not found' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
});

// Start the server on the configured port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
