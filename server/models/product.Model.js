import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    supplier:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
        default: 0,
    },

    stock: {
        type: Number,
        default: 0
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
}, { timestamps: true });

ProductSchema.index({ sku: 1, organization: 1 }, { unique: true });


ProductSchema.virtual('sales', {
    ref: 'Sale',
    localField: '_id',
    foreignField: 'items.product',
    count: true
});

export default mongoose.model('Product', ProductSchema);