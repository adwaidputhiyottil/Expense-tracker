// Import mongoose to interact with MongoDB
const mongoose = require('mongoose');

// Define an asynchronous function to connect to the database
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        // Log a success message with the host name if connection is successful
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log an error message if the connection fails
        console.error(`Error: ${error.message}`);
        // Exit the process with failure code 1
        process.exit(1);
    }
};

// Export the connectDB function to be used in server.js
module.exports = connectDB;
