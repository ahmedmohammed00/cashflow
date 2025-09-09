import mongoose from 'mongoose';

const SaleItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },/*
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price at the time of sale
  cost: { type: Number, required: true, default: 0 }, // Cost at the time of sale
  image: { type: String }
  */
}, { _id: false });

const SaleSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },

    items: [SaleItemSchema],
    subtotal: {
        type: Number,
        required: true,
    },

    discountAmount: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    costOfGoods: {
        type: Number,
        required: true,
        default: 0
    },
    couponCode: {
        type: String,
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash', 'e-wallet'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Completed', 'Pending', 'Cancelled', 'Refunded'],
        default: 'Pending',
    },
    placedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    notes: {
        type: String,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
}, { timestamps: true });

SaleSchema.index({ orderId: 1, organization: 1 }, { unique: true });

export default mongoose.model('Sale', SaleSchema);