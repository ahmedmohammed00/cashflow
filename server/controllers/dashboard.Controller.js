import mongoose from "mongoose";
import Sale from "../models/sale.Model.js";
import User from "../models/user.Model.js";
import Product from "../models/product.Model.js";
import { subDays } from "date-fns";

/**
 * Dashboard Summary Controller
 * Fetches total revenue, orders, customers, top products, and recent sales.
 */
export const getDashboardData = async (req, res) => {
    try {
        const { orgId, from, to } = req.query;

        if (!orgId) {
            return res.status(400).json({ message: "Organization ID is required" });
        }

        const startDate = from ? new Date(from) : subDays(new Date(), 30);
        const endDate = to ? new Date(to) : new Date();

        const diff = endDate.getTime() - startDate.getTime();
        const prevStart = new Date(startDate.getTime() - diff);
        const prevEnd = new Date(startDate.getTime());

        // === Current Period Sales ===
        const currentSales = await Sale.find({
            organization: orgId,
            createdAt: { $gte: startDate, $lte: endDate },
            status: "Completed",
        });

        // === Previous Period Sales ===
        const prevSales = await Sale.find({
            organization: orgId,
            createdAt: { $gte: prevStart, $lte: prevEnd },
            status: "Completed",
        });

        // === Metrics ===
        const totalRevenue = currentSales.reduce((sum, s) => sum + s.total, 0);
        const totalOrders = currentSales.length;
        const costOfGoods = currentSales.reduce((sum, s) => sum + s.costOfGoods, 0);
        const profit = totalRevenue - costOfGoods;

        const prevRevenue = prevSales.reduce((sum, s) => sum + s.total, 0);
        const prevOrders = prevSales.length;

        const revenueChange = prevRevenue
            ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
            : 0;
        const orderChange = prevOrders
            ? (((totalOrders - prevOrders) / prevOrders) * 100).toFixed(1)
            : 0;

        // === New Customers ===
        const newCustomers = await User.countDocuments({
            organization: orgId,
            createdAt: { $gte: startDate, $lte: endDate },
        });

        // === Top 5 Products ===
        const topProductsAgg = await Sale.aggregate([
            {
                $match: {
                    organization: new mongoose.Types.ObjectId(orgId),
                    status: "Completed",
                },
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    totalSold: { $sum: 1 },
                    totalRevenue: { $sum: "$total" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    _id: 0,
                    productId: "$product._id",
                    name: "$product.name",
                    price: "$product.price",
                    totalSold: 1,
                    totalRevenue: 1,
                },
            },
        ]);

        // === Recent 10 Sales ===
        const recentSales = await Sale.find({ organization: orgId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate({
                path: "placedBy",
                select: "name email",
            })
            .populate({
                path: "items.product",
                select: "name price image",
            });

        const formattedRecentSales = recentSales.map((sale) => ({
            id: sale._id,
            orderId: sale.orderId,
            total: sale.total,
            status: sale.status,
            paymentMethod: sale.paymentMethod,
            createdAt: sale.createdAt,
            placedBy: sale.placedBy ? sale.placedBy.name : "Unknown",
            items: sale.items.map((i) => ({
                name: i.product?.name || "Deleted Product",
                price: i.product?.price || 0,
            })),
        }));

        // === Response ===
        res.status(200).json({
            revenue: {
                value: totalRevenue,
                change: parseFloat(revenueChange),
            },
            orders: {
                value: totalOrders,
                change: parseFloat(orderChange),
            },
            profit,
            newCustomers,
            topProducts: topProductsAgg,
            recentSales: formattedRecentSales,
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            message: "Error fetching dashboard data",
            error: error.message,
        });
    }
};
