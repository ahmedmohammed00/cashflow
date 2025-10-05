import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT tokens
 * Supports tokens from Authorization header, cookies, or query parameters
 */
const authMiddleware = async function(req, res, next) {
    let token;
    
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } 
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // Check for token in query params (not recommended for production)
    else if (req.query.token) {
        token = req.query.token;
    }

    // If no token found
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No authentication token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data to request object
        req.user = decoded.user;
        
        next();
    } catch (err) {
        // Handle different JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired. Please login again' 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid authentication token' 
        });
    }
};

export default authMiddleware;