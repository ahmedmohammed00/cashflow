import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
    dashboard: { type: Boolean, default: true },
    pos: { type: Boolean, default: true },
    sales: { type: Boolean, default: true },
    products: { type: Boolean, default: false },
    customers: { type: Boolean, default: false },
    inventory: { type: Boolean, default: false },
    coupons: { type: Boolean, default: false },
    reporting: { type: Boolean, default: false },
}, { _id: false });


const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    permissions: {
        type: PermissionSchema,
        default: () => ({})
    }
}, { timestamps: true });

export default mongoose.model('Organization', OrganizationSchema);