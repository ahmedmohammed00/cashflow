import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import apiRoutes from './routes/api.js';
import connectDB from "./config/config.js";

// Initialize App
const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3001', // frontend origin
    credentials: true,               // allow cookies
}));
app.use(cookieParser());

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
