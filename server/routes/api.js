import express from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { registerUser, loginUser, getMe , checkAuth } from '../controllers/auth.Controller.js';
import {getAllProducts , addProduct ,getProduct , updateProduct , deleteProduct} from "../controllers/product.Controller.js";
import {addCategory, getAllCategories} from "../controllers/category.Controller.js";
import {addCoupon, deleteCoupon, getAllCoupons, updateCoupon} from "../controllers/coupon.Controller.js";
// import dashboardController from "../controllers/reports.Controller.js";

// import reportsController from "../controllers/reports.Controller.js";

const router = express.Router();

// --- Public Auth Routes ---
router.route('/auth/register').post( registerUser);
router.route('/auth/login').post(loginUser);
router.route('/auth/me').get(authMiddleware, getMe);
router.route('/auth/check').get(authMiddleware,checkAuth);


router.route('/products')
    .get(authMiddleware,getAllProducts)
    .post(authMiddleware , addProduct);

router.route('/products/:id')
    .get(authMiddleware, getProduct)
    .put(authMiddleware, updateProduct)
    .delete(authMiddleware, deleteProduct);


router.route('/categories')
    .get(authMiddleware,getAllCategories)
    .post(authMiddleware,addCategory)



router.route('/coupons')
    .get(authMiddleware,getAllCoupons)
    .post(authMiddleware,addCoupon)
    .put(authMiddleware, updateCoupon)
    .delete(authMiddleware, deleteCoupon);

// Dashboard Routes
/*
router.route('/dashboard/summary').get(authMiddleware, dashboardController.getDashboardSummary);
router.route('/dashboard/recent-sales').get(authMiddleware, dashboardController.getRecentSales);
router.route('/dashboard/top-products').get(authMiddleware, dashboardController.getTopSellingProducts);
router.route('/dashboard/sales-by-period').get(authMiddleware, dashboardController.getSalesByTimePeriod);
router.route('/dashboard/export').get(authMiddleware, dashboardController.exportDashboardData);

 */
/*
// Reports Routes
router.route('/reports/sales').get(authMiddleware, reportsController.generateSalesReport);
router.route('/reports/inventory').get(authMiddleware, reportsController.generateInventoryReport);
router.route('/reports/revenue').get(authMiddleware, reportsController.generateRevenueReport);
router.route('/reports/custom').post(authMiddleware, reportsController.generateCustomReport);
*/
export default router;