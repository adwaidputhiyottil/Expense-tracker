// Import mongoose to define the data structure
const mongoose = require('mongoose');

// Create a new schema for the 'Expense' collection
const ExpenseSchema = new mongoose.Schema({
    // Title field: String, required, trimmed of whitespace, max length 50
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    // Amount field: Number, required
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    // Category field: String, required, must be one of the specified values
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']
    },
    // Date field: Date type, defaults to the current date and time
    date: {
        type: Date,
        default: Date.now
    },
    // Note field: String, optional, max length 200
    note: {
        type: String,
        maxlength: [200, 'Note cannot be more than 200 characters']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' timestamps to each document
    timestamps: true
});

// Export the model as 'Expense' so it can be used in controllers
module.exports = mongoose.model('Expense', ExpenseSchema);
