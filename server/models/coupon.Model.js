import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        uppercase: true,
    },
    discountType: {
        type: String,
        required: true,
        enum: ['percentage', 'fixed'],
    },
    discountValue: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    usageLimit: {
        type: Number,
        default: null, // null means unlimited
    },
    expiryDate: {
        type: Date,
        default: null,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
}, { timestamps: true });

// Ensure coupon codes are unique per organization
CouponSchema.index({ code: 1, organization: 1 }, { unique: true });


export default mongoose.model('Coupon', CouponSchema);