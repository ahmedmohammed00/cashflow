import Product from '../models/product.Model.js';
import Sale from '../models/sale.Model.js';
// Not used in this controller's current scope, but kept as per original
import mongoose from 'mongoose';

// IMPORTANT: All routes in this controller are protected and assume an auth middleware
// has run and populated `req.user` with the authenticated user's details,
// including `req.user.organization`.

/**
 * @desc    Get all products for the organization
 * @route   GET /api/products
 * @access  Private
 */

export const getAllProducts = async (req, res) => {
    try {
        // Find all products belonging to the authenticated user's organization
        const products = await Product.find({ organization: req.user.organization })
            .populate('category', 'name') // Populate category name for display
            .lean(); // Use .lean() for faster query execution if not modifying Mongoose documents

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        res.status(500).json({ success: false, error: 'Server Error fetching products.' });
    }
};

/**
 * @desc    Get single product for the organization
 * @route   GET /api/products/:id
 * @access  Private
 */
export const getProduct = async (req, res) => {
    try {
        // Find a single product by its ID and ensure it belongs to the authenticated user's organization
        const product = await Product.findOne({ _id: req.params.id, organization: req.user.organization })
            .populate('category', 'name') // Populate category name
            .lean();

        if (!product)
        {
            // If product not found or doesn't belong to the organization
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        // Handle Mongoose CastError if ID format is invalid
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid Product ID format.' });
        }
        console.error("Error in getProduct:", error);
        res.status(500).json({ success: false, error: 'Server Error fetching product.' });
    }
};

/**
 * @desc    Create a product for the organization
 * @route   POST /api/products
 * @access  Private
 */
export const addProduct = async (req, res) => {
    try {
        const { name, sku, description, categoryId, price, cost, stock, supplier, imageUrl } = req.body;

        // Basic validation (more robust validation should be done with Joi/Express-validator)
        if (!name || !sku || !description || !price || !cost || !stock || !supplier) {
            return res.status(400).json({ success: false, error: 'Missing required product fields.' });
        }

        // Determine initial status based on stock
        const status = stock > 0 ? 'in_stock' : 'out_of_stock';

        // Create the Product with all fields, including inventory-related ones
        const product = await Product.create({
            name,
            sku,
            description,
            category: categoryId, // Mongoose will handle ObjectId conversion if categoryId is string
            price,
            cost,
            stock,
            supplier,
            status,
            organization: req.user.organization
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {

        console.error("Error in addProduct:", error);
        res.status(500).json({ success: false, error: 'Server Error creating product.' });
    }
};

/**
 * @desc    Update a product for the organization
 * @route   PUT /api/products/:id
 * @access  Private
 */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, description, categoryId, price, cost, stock, supplier } = req.body;

        // Find the product by ID and organization
        let product = await Product.findOne({ _id: id, organization: req.user.organization });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Prepare update object, only include fields that are provided
        const updateFields = {};
        if (name !== undefined) product.name = name;
        if (sku !== undefined) product.sku = sku;
        if (description !== undefined) product.description = description;
        if (categoryId !== undefined) product.category = categoryId;
        if (price !== undefined) product.price = price;
        if (cost !== undefined) product.cost = cost;
        if (stock !== undefined) product.stock = stock;
        if (supplier !== undefined) product.supplier = supplier;

        // Update status based on new stock value if stock is provided
        if (stock !== undefined) {
            product.status = stock > 0 ? 'in_stock' : 'out_of_stock';
        }

        await product.save(); // Save the updated product

        res.status(200).json({ success: true, data: product }); // Return the updated product
    }
    catch (error)
    {

        res.status(409).json({ success: false, error: errorMessage });
    }

};

/**
 * @desc    Delete a product for the organization
 * @route   DELETE /api/products/:id
 * @access  Private
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, organization: req.user.organization });

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }


        const salesCount = await Sale.countDocuments({ 'items.product': product._id, organization: req.user.organization });
        if (salesCount > 0) {
            return res.status(400).json({ success: false, error: 'Product cannot be deleted as it is linked to existing sales. Consider marking it as inactive instead.' });
        }

        // Delete the Product itself (no associated InventoryItem to delete separately now)
        await product.deleteOne();
        console.log(`Deleted product ${product._id}`);

        res.status(200).json({ success: true, data: {}, message: 'Product deleted successfully.' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid Product ID format.' });
        }
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ success: false, error: 'Server Error deleting product.' });
    }
};