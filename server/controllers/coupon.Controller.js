import Coupon from '../models/coupon.Model.js';

// @desc    Get all coupons for the organization
// @route   GET /api/coupons
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ organization: req.user.organization });
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single coupon for the organization
// @route   GET /api/coupons/:id
export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.params.id, organization: req.user.organization });
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }
        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a coupon for the organization
// @route   POST /api/coupons
export const addCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, usageLimitEnabled, usageLimit, expiryDate } = req.body;

        const newCouponData = {
            ...req.body,
            organization: req.user.organization, // Assign to the user's organization
            usageLimit: usageLimitEnabled ? usageLimit : null,
            expiryDate: expiryDate || null,
            status: 'active', // Default to active
        };

        const coupon = await Coupon.create(newCouponData);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update a coupon for the organization
// @route   PUT /api/coupons/:id
export const updateCoupon = async (req, res) => {
    try {
        let coupon = await Coupon.findOne({ _id: req.params.id, organization: req.user.organization });

        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }

        const { code, discountType, discountValue, usageLimitEnabled, usageLimit, expiryDate, status } = req.body;

        const updateData = {
            code,
            discountType,
            discountValue,
            usageLimit: usageLimitEnabled ? usageLimit : null,
            expiryDate: expiryDate || null,
            status
        };

        coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a coupon for the organization
// @route   DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.params.id, organization: req.user.organization });

        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Coupon not found' });
        }

        await coupon.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};