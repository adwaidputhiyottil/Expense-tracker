// IMPORTANT: Load environment variables FIRST
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleware");

// Initialize the Express application
const app = express();

// --- Global Middleware ---

// CORS (FIXED placement + config)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
    credentials: true,
  }),
);

// Parse incoming JSON request bodies
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

// Connect to MongoDB
connectDB().then(() => {
  const seedAdmin = require("./utils/seedAdmin");
  seedAdmin();
});

// --- Routes ---

app.use("/api/auth", authRoutes);
app.use("/api/expenses", protect, expenseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analysis", analysisRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- 404 Handler ---
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, error: "Route not found" });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.stack);
  res
    .status(500)
    .json({ success: false, error: err.message || "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
