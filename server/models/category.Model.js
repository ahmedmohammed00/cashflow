import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
}, { timestamps: true });

// Ensure category names are unique per organization
CategorySchema.index({ name: 1, organization: 1 }, { unique: true });

export default mongoose.model('Category', CategorySchema);