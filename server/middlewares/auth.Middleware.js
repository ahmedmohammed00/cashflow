import jwt from 'jsonwebtoken';

const authMiddleware = async function(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if not token
    if (!authHeader) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Token is expected to be in "Bearer <token>" format

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ msg: 'Token format is invalid, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET );

        req.user = decoded.user;
        console.log(decoded);
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default authMiddleware;