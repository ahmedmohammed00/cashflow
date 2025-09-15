import Category from '../models/category.Model.js';
import Product from '../models/product.Model.js';

// @desc    Get all categories for the organization
// @route   GET /api/categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ organization: req.user.organization }).sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a category for the organization
// @route   POST /api/categories
export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if category with the same name already exists for this organization
        const existingCategory = await Category.findOne({ name, organization: req.user.organization });
        if (existingCategory) {
            return res.status(400).json({ success: false, error: 'Category with this name already exists' });
        }

        const category = await Category.create({ name, organization: req.user.organization });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a category for the organization
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, organization: req.user.organization });

        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        // Check if any products are using this category before deleting.
        const productCount = await Product.countDocuments({ category: req.params.id, organization: req.user.organization });
        if (productCount > 0) {
            return res.status(400).json({ success: false, error: 'Cannot delete category. It is currently assigned to one or more products.'});
        }

        await category.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};