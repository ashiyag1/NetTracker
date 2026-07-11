// 1. Import our tools using modern ES Module syntax
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns';
import dotenv from 'dotenv';
import cronRoutes from './routes/cronRoutes.js';

// Import our routes (relative imports MUST include the .js extension in ES Modules)
import deviceRoutes from './routes/deviceRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load our environment variables
dotenv.config();

// 2. Set public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(() => {
    console.log('Connected to MongoDB');
   })
   .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
   });

// Link our routes
app.use('/api/devices', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cron', cronRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the NetTrack API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
