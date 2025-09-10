import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import apiRoutes from './routes/api.js';
import connectDB from "./config/config.js";


// Initialize App
const app = express();
const PORT = process.env.PORT || 5005;
app.use(express.json());


// Middleware
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', // frontend origin
    credentials: true,               // allow cookies (important for JWT in cookies)
}));

app.use('/api' , apiRoutes);


connectDB();


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})