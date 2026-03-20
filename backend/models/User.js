// Import mongoose to define the user structure
const mongoose = require('mongoose');
// Import bcryptjs for password hashing
const bcrypt = require('bcryptjs');

// Create a new schema for the 'User' collection
const UserSchema = new mongoose.Schema({
    // Name field: String, required
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    // Email field: String, required, unique, and matched against regex for validation
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    // Password field: String, required, min length 6, select: false (don't return in queries by default)
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    // Role field: String, enum ['user', 'admin'], default 'user'
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Last seen field: Date
    lastSeen: {
        type: Date,
        default: Date.now
    }
}, {
    // Automatically add 'createdAt' and 'updatedAt' timestamps
    timestamps: true
});

// Middleware to hash the password before saving it to the database
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);
