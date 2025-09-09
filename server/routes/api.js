import express from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { registerUser, loginUser, getMe } from '../controllers/auth.Controller.js';


const router = express.Router();



// --- Public Auth Routes ---
router.route('/auth/register').post(registerUser);
router.route('/auth/login').post(loginUser);
router.route('/auth/me').get(authMiddleware, getMe);

export default router;