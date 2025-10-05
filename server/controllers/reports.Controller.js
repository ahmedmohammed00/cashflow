import Product from '../models/product.Model.js';
import Sale from '../models/sale.Model.js';
import User from '../models/user.Model.js';
import moment from 'moment';
import { generateExcelReport, createDynamicReport } from '../utils/excelGenerator.js';


export const generateSalesReport = async (req, res, next) => {
  try {
    const organizationId = req.user.organization;
    const { 
      startDate, 
      endDate, 
      format = 'excel',
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query filters
    const query = { organization: organizationId };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Get sales data with populated customer and items
    const sales = await Sale.find(query)
      .populate('customer', 'name email mobile')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .lean();
    
    // Format data for report
    const formattedSales = sales.map(sale => ({
      id: sale._id.toString(),
      date: sale.createdAt,
      customer: sale.customer ? sale.customer.name : 'Walk-in Customer',
      items: sale.items.length,
      subtotal: sale.subtotal,
      discount: sale.discount,
      tax: sale.tax,
      totalAmount: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
      status: sale.status
    }));
    
    if (format === 'json') {
      return res.status(200).json({
        success: true,
        data: formattedSales
      });
    }
    
    // Generate Excel report
    const reportBuffer = await generateExcelReport({
      title: 'Sales Report',
      headers: ['ID', 'Date', 'Customer', 'Items', 'Subtotal', 'Discount', 'Tax', 'Total Amount', 'Payment Method', 'Status'],
      columns: [
        { key: 'id', type: 'string' },
        { key: 'date', type: 'datetime' },
        { key: 'customer', type: 'string' },
        { key: 'items', type: 'number' },
        { key: 'subtotal', type: 'currency' },
        { key: 'discount', type: 'currency' },
        { key: 'tax', type: 'currency' },
        { key: 'totalAmount', type: 'currency' },
        { key: 'paymentMethod', type: 'string' },
        { key: 'status', type: 'string' }
      ],
      data: formattedSales,
      styling: {
        columnWidths: [15, 20, 25, 10, 15, 15, 15, 15, 15, 15]
      }
    });
    
    // Set response headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=sales-report-${moment().format('YYYY-MM-DD')}.xlsx`);
    
    // Send the Excel file
    res.send(reportBuffer);
    
  } catch (error) {
    next(error);
  }
};


export const generateInventoryReport = async (req, res, next) => {
  try {
    const organizationId = req.user.organization;
    const { 
      category, 
      lowStock, 
      format = 'excel',
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;
    
    // Build query filters
    const query = { organization: organizationId };
    
    if (category) {
      query.category = category;
    }
    
    if (lowStock === 'true') {
      query.stock = { $lt: 10 };
    }
    
    // Get products data
    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .lean();
    
    // Format data for report
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      unit: product.unit,
      createdAt: product.createdAt
    }));
    
    if (format === 'json') {
      return res.status(200).json({
        success: true,
        data: formattedProducts
      });
    }
    
    // Generate Excel report
    const reportBuffer = await generateExcelReport({
      title: 'Inventory Report',
      headers: ['ID', 'Name', 'SKU', 'Barcode', 'Category', 'Price', 'Cost', 'Stock', 'Unit', 'Created Date'],
      columns: [
        { key: 'id', type: 'string' },
        { key: 'name', type: 'string' },
        { key: 'sku', type: 'string' },
        { key: 'barcode', type: 'string' },
        { key: 'category', type: 'string' },
        { key: 'price', type: 'currency' },
        { key: 'cost', type: 'currency' },
        { key: 'stock', type: 'number' },
        { key: 'unit', type: 'string' },
        { key: 'createdAt', type: 'date' }
      ],
      data: formattedProducts,
      styling: {
        columnWidths: [15, 30, 15, 15, 15, 15, 15, 10, 10, 20]
      }
    });
    
    // Set response headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-report-${moment().format('YYYY-MM-DD')}.xlsx`);
    
    // Send the Excel file
    res.send(reportBuffer);
    
  } catch (error) {
    next(error);
  }
};


export const generateDynamicReport = async (req, res, next) => {
  try {
    const organizationId = req.user.organization;
    const { reportType } = req.params;
    const filters = req.query;
    
    let data = [];
    let config = {};
    
    // Configure report based on type
    switch (reportType) {
      case 'sales':
        // Get sales data with filters
        const query = { organization: organizationId };
        
        if (filters.startDate || filters.endDate) {
          query.createdAt = {};
          if (filters.startDate) {
            query.createdAt.$gte = new Date(filters.startDate);
          }
          if (filters.endDate) {
            query.createdAt.$lte = new Date(filters.endDate);
          }
        }
        
        if (filters.status) {
          query.status = filters.status;
        }
        
        if (filters.paymentMethod) {
          query.paymentMethod = filters.paymentMethod;
        }
        
        const sales = await Sale.find(query)
          .populate('customer', 'name email mobile')
          .sort({ createdAt: -1 })
          .lean();
        
        data = sales.map(sale => ({
          id: sale._id.toString(),
          date: sale.createdAt,
          customer: sale.customer ? sale.customer.name : 'Walk-in Customer',
          items: sale.items.length,
          subtotal: sale.subtotal,
          discount: sale.discount,
          tax: sale.tax,
          totalAmount: sale.totalAmount,
          paymentMethod: sale.paymentMethod,
          status: sale.status
        }));
        
        config = {
          title: 'Sales Report',
          headers: ['ID', 'Date', 'Customer', 'Items', 'Subtotal', 'Discount', 'Tax', 'Total Amount', 'Payment Method', 'Status'],
          columns: [
            { key: 'id', type: 'string' },
            { key: 'date', type: 'datetime' },
            { key: 'customer', type: 'string' },
            { key: 'items', type: 'number' },
            { key: 'subtotal', type: 'currency' },
            { key: 'discount', type: 'currency' },
            { key: 'tax', type: 'currency' },
            { key: 'totalAmount', type: 'currency' },
            { key: 'paymentMethod', type: 'string' },
            { key: 'status', type: 'string' }
          ],
          styling: {
            columnWidths: [15, 20, 25, 10, 15, 15, 15, 15, 15, 15]
          }
        };
        break;
        
      case 'inventory':
        // Get inventory data with filters
        const productQuery = { organization: organizationId };
        
        if (filters.category) {
          productQuery.category = filters.category;
        }
        
        if (filters.lowStock === 'true') {
          productQuery.stock = { $lt: 10 };
        }
        
        const products = await Product.find(productQuery)
          .sort({ name: 1 })
          .lean();
        
        data = products.map(product => ({
          id: product._id.toString(),
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          category: product.category,
          price: product.price,
          cost: product.cost,
          stock: product.stock,
          unit: product.unit,
          createdAt: product.createdAt
        }));
        
        config = {
          title: 'Inventory Report',
          headers: ['ID', 'Name', 'SKU', 'Barcode', 'Category', 'Price', 'Cost', 'Stock', 'Unit', 'Created Date'],
          columns: [
            { key: 'id', type: 'string' },
            { key: 'name', type: 'string' },
            { key: 'sku', type: 'string' },
            { key: 'barcode', type: 'string' },
            { key: 'category', type: 'string' },
            { key: 'price', type: 'currency' },
            { key: 'cost', type: 'currency' },
            { key: 'stock', type: 'number' },
            { key: 'unit', type: 'string' },
            { key: 'createdAt', type: 'date' }
          ],
          styling: {
            columnWidths: [15, 30, 15, 15, 15, 15, 15, 10, 10, 20]
          }
        };
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }
    
    // Generate Excel report
    const reportBuffer = await createDynamicReport({
      reportType,
      filters,
      data,
      config
    });
    
    // Set response headers for Excel download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${reportType}-report-${moment().format('YYYY-MM-DD')}.xlsx`);
    
    // Send the Excel file
    res.send(reportBuffer);
    
  } catch (error) {
    next(error);
  }
};

export default {
  generateSalesReport,
  generateInventoryReport,
  generateDynamicReport
};