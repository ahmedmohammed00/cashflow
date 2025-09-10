import express from 'express';
import authMiddleware from '../middlewares/auth.Middleware.js';
import { registerUser, loginUser, getMe } from '../controllers/auth.Controller.js';
import {getAllProducts , addProduct ,getProduct , updateProduct , deleteProduct} from "../controllers/product.Controller.js";

const router = express.Router();



// --- Public Auth Routes ---
router.route('/auth/register').post(registerUser);
router.route('/auth/login').post(loginUser);
router.route('/auth/me').get(authMiddleware, getMe);



router.route('/products')
    .get(authMiddleware,getAllProducts)
    .post(authMiddleware, addProduct);

router.route('/products/:id')
    .get(authMiddleware, getProduct)
    .put(authMiddleware, updateProduct)
    .delete(authMiddleware, deleteProduct);
export default router;