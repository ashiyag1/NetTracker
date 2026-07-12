import express from 'express';
import User from '../models/User.js'; // Import our User schema (must include .js)
import * as jose from 'jose'; // Import jose for Edge-compatible JWTs

const router = express.Router();

// 1. REGISTER A USER (POST /api/auth/register)
router.post('/register', async (req, res) => {
    // A. Destructure clientCompany from the request body
    const { username, password, role, clientCompany } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // B. Save the clientCompany to the database
        const user = await User.create({ 
            username, 
            password, 
            role, 
            clientCompany: role === 'client' ? clientCompany : '' // Only save if they are a client
        });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ id: user._id.toString() })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(secret);

        // C. Send back user details (including role and clientCompany)
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            clientCompany: user.clientCompany, 
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. LOGIN A USER (POST /api/auth/login)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // A. Find the user by their username
        const user = await User.findOne({ username });

        // B. If user exists, compare password hashes
        if (user && (await user.matchPassword(password))) {
            
            // C. Generate a JWT Token using jose (Edge-compatible)
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const token = await new jose.SignJWT({ id: user._id.toString() })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('30d')
                .sign(secret);

            // D. Return user info and token
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                clientCompany: user.clientCompany, 
                token: token
            });

        } else {
            // 401 means "Unauthorized"
            res.status(401).json({ message: 'Invalid username or password' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. GOOGLE SIGN IN (POST /api/auth/google)
router.post('/google', async (req, res) => {
    const { token, clientCompany } = req.body;

    try {
        // A. Verify Google ID token using Google API
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const payload = await verifyRes.json();

        if (!verifyRes.ok) {
            return res.status(400).json({ message: 'Invalid Google Identity token' });
        }

        const { email } = payload;

        // B. Check if user already exists
        let user = await User.findOne({ username: email });

        if (!user) {
            // New User: Check if clientCompany was provided in the second step of the flow
            if (!clientCompany) {
                // If no company provided, pause registration and tell frontend to prompt the user
                return res.status(428).json({ 
                    requiresCompany: true, 
                    message: 'Please provide your Client Company Name to complete registration.' 
                });
            }

            // Register a new Client user using their Google details and provided company
            user = await User.create({
                username: email,
                password: Math.random().toString(36).slice(-10), // Random password
                role: 'client', // Default role is client
                clientCompany: clientCompany // Uses the company provided by the user
            });
        }

        // C. Generate NetTrack JWT token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const nettrackToken = await new jose.SignJWT({ id: user._id.toString() })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(secret);

        // D. Return user info and token
        res.status(200).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            clientCompany: user.clientCompany,
            token: nettrackToken
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;