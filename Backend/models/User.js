import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // For password hashing

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['admin', 'technician', 'client'],
        default: 'client'
    },
    // Add this field below role:
    clientCompany: {
        type: String,
        trim: true,
        default: '' // Admins and Technicians won't have a clientCompany
    }
}, {
    timestamps: true
});

// PASSWORD HASHING MIDDLEWARE
// Mongoose allows us to run code automatically BEFORE a document is saved to the database.
UserSchema.pre('save', async function() {
    // If the password hasn't been modified, skip hashing
    if (!this.isModified('password')) {
        return;
    }

    // 1. Generate a "Salt"
    const salt = await bcrypt.genSalt(10);
    // 2. Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
});

// METHOD TO COMPARE PASSWORDS
// We add a custom function to our model to help us check passwords during login
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);