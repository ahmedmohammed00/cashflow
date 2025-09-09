import Sale from '../models/sale.Model.js';
import Product from '../models/product.Model.js';
import Coupon from '../models/coupon.Model.js';
import mongoose from 'mongoose';

export const createSale = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        // Start transaction
        session.startTransaction();

        const {
            items,
            customer,
            paymentMethod,
            notes,
            couponCode,
        } = req.body;

        // Validate input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Items are required and must be a non-empty array.' });
        }
        if (!customer || !customer.id) {
            return res.status(400).json({ success: false, error: 'Customer is required.' });
        }
        if (!paymentMethod || !['card', 'cash', 'e-wallet'].includes(paymentMethod)) {
            return res.status(400).json({ success: false, error: 'Invalid or missing payment method.' });
        }

        // Fetch products
        const productIds = items.map(item => item.id);
        const productsFromDb = await Product.find({ '_id': { $in: productIds } }).session(session);
        const productMap = new Map(productsFromDb.map(p => [p._id.toString(), p]));

        // Initialize totals
        let subtotal = 0;
        let costOfGoods = 0;
        const saleItems = [];

        // Build sale items and calculate subtotal and cost
        for (const item of items) {
            const product = productMap.get(item.id);
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ success: false, error: `Product with ID ${item.id} not found.` });
            }
            const quantity = item.quantity;
            if (quantity <= 0) {
                await session.abortTransaction();
                return res.status(400).json({ success: false, error: `Invalid quantity for product ${product.name}.` });
            }
            const price = product.price;
            const cost = product.cost || 0;

            subtotal += price * quantity;
            costOfGoods += cost * quantity;

            saleItems.push({
                product: product._id,
                name: product.name,
                quantity,
                price,
                cost,
                image: product.image,
            });
        }

        // Handle coupon if provided
        let discountAmount = 0;
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, organization: req.user.organization }).session(session);
            if (!coupon) {
                await session.abortTransaction();
                return res.status(404).json({ success: false, error: 'Coupon not found.' });
            }
            if (coupon.expiryDate && new Date() > coupon.expiryDate) {
                await session.abortTransaction();
                return res.status(400).json({ success: false, error: 'Coupon has expired.' });
            }
            if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
                await session.abortTransaction();
                return res.status(400).json({ success: false, error: 'Coupon usage limit reached.' });
            }
            // Calculate discount
            if (coupon.discountType === 'fixed') {
                discountAmount = Math.min(coupon.discountValue, subtotal);
            } else if (coupon.discountType === 'percentage') {
                discountAmount = (subtotal * coupon.discountValue) / 100;
                if (discountAmount > subtotal) discountAmount = subtotal;
            } else {
                await session.abortTransaction();
                return res.status(400).json({ success: false, error: 'Invalid coupon discount type.' });
            }
        }

        // Calculate totals
        const total = subtotal - discountAmount;

        // Generate unique orderId
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create new sale document
        const newSale = new Sale({
            orderId,
            customer: customer.id,
            items: saleItems,
            subtotal,
            discountAmount,
            total,
            costOfGoods,
            couponCode: coupon ? coupon.code : null,
            paymentMethod,
            status: 'Completed', // Assuming immediate completion
            placedBy: req.user.id,
            notes,
            organization: req.user.organization,
        });

        // Save sale
        await newSale.save({ session });

        // Update product stock
        for (const item of saleItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }
        /*

        // Update customer record
        await Customer.findByIdAndUpdate(
            customer.id,
            {
                $inc: { totalOrders: 1, totalSpent: total },
                $set: { lastOrderDate: new Date() },
            },
            { session }
        );

         */

        // Update coupon usage
        if (coupon) {
            await Coupon.findOneAndUpdate(
                { _id: coupon._id },
                { $inc: { usageCount: 1 } },
                { session }
            );
        }

        // Commit transaction
        await session.commitTransaction();

        return res.status(201).json({ success: true, data: newSale });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        return res.status(500).json({ success: false, error: 'Server error' });
    } finally {
        session.endSession();
    }
};