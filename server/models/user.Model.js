import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'staff'],
        default: 'staff',
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'pending',
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


export default mongoose.model('User', UserSchema);