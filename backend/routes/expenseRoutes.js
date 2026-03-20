// Import express to use the router functionality
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the CRUD controller functions from the controllers folder
const {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

// Define the route for the base path '/' (e.g., /api/expenses)
router
    .route('/')
    // Map GET requests to the getExpenses controller
    .get(getExpenses)
    // Map POST requests to the addExpense controller
    .post(addExpense);

// Define the route for paths with an ID parameter '/:id' (e.g., /api/expenses/123)
router
    .route('/:id')
    // Map PUT requests to the updateExpense controller
    .put(updateExpense)
    // Map DELETE requests to the deleteExpense controller
    .delete(deleteExpense);

// Export the router so it can be mounted in server.js
module.exports = router;
