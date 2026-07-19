import User from '../models/User.js';
import * as jose from 'jose';

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    const { username, password, role, clientCompany } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = await User.create({ 
            username, 
            password, 
            role, 
            clientCompany: role === 'client' ? clientCompany : ''
        });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ id: user._id.toString() })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(secret);

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
};

// @desc    Login a user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const token = await new jose.SignJWT({ id: user._id.toString() })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('30d')
                .sign(secret);

            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                clientCompany: user.clientCompany, 
                token: token
            });

        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Sign In
// @route   POST /api/auth/google
export const googleLogin = async (req, res) => {
    const { token, clientCompany } = req.body;

    try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
        const payload = await verifyRes.json();

        if (!verifyRes.ok) {
            return res.status(400).json({ message: 'Invalid Google Identity token' });
        }

        const { email } = payload;
        let user = await User.findOne({ username: email });

        if (!user) {
            if (!clientCompany) {
                return res.status(428).json({ 
                    requiresCompany: true, 
                    message: 'Please provide your Client Company Name to complete registration.' 
                });
            }

            user = await User.create({
                username: email,
                password: Math.random().toString(36).slice(-10),
                role: 'client',
                clientCompany: clientCompany
            });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const nettrackToken = await new jose.SignJWT({ id: user._id.toString() })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d')
            .sign(secret);

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
};
