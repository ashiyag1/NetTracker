import * as jose from 'jose';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // Check if the request has an Authorization header that starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Header format: "Bearer eyJhbGciOi..."
            // Split by space and grab the token part (index 1)
            token = req.headers.authorization.split(' ')[1];

            // Verify the token signature using jose
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await jose.jwtVerify(token, secret);

            // Fetch the user details from DB (excluding password for security)
            // and attach it to req.user so routes can see WHO made the request
            req.user = await User.findById(payload.id).select('-password');

            next(); // Everything is good! Proceed to the route handler.
        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token was found in headers at all
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token found' });
    }
};

// Middleware to restrict access based on roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user was attached by our protect middleware
        if (!roles.includes(req.user.role)) {
            // 403 means "Forbidden" (You are logged in, but you don't have permission)
            return res.status(403).json({ message: 'Forbidden: You do not have permission for this action' });
        }
        next();
    };
};