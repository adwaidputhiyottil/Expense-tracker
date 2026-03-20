// Import the Expense model
const Expense = require('../models/Expense');

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
    try {
        // Find expenses that belong specifically to the current user (req.user.id)
        // Sort them by date in descending order (latest first)
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        
        // Return success response with the user's expenses
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });
    } catch (error) {
        // Return a server error if the operation fails
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a new expense for the logged-in user
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
    try {
        // Add the logged-in user's ID to the request body before creating the expense
        req.body.user = req.user.id;

        // Create the expense record in the database
        const expense = await Expense.create(req.body);

        // Return a success response with the created expense
        res.status(201).json({
            success: true,
            data: expense
        });
    } catch (error) {
        // Check if the error is a validation error from Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            // Return a general server error for other cases
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};

// @desc    Update an expense belonging to the logged-in user
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
    try {
        // Find the expense by ID
        let expense = await Expense.findById(req.params.id);

        // If not found, return a 404 error
        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }

        // Check if the expense belongs to the logged-in user
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this expense' });
        }

        // Perform the update
        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Enforce schema rules
        });

        // Return success response with the updated expense
        res.status(200).json({
            success: true,
            data: expense
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete an expense belonging to the logged-in user
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
    try {
        // Find the expense by ID
        const expense = await Expense.findById(req.params.id);

        // If not found, return a 404 error
        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }

        // Check if the expense belongs to the logged-in user
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this expense' });
        }

        // Delete the record from the database
        await expense.deleteOne();

        // Return a 200 success response
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
