import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import deviceRoutes from '../Backend/routes/deviceRoutes.js';
import authRoutes from '../Backend/routes/authRoutes.js';
import cronRoutes from '../Backend/routes/cronRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Disable Mongoose buffering so errors surface immediately
mongoose.set('bufferCommands', false);

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });

  isConnected = true;
}

// Middleware: connect to DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(500).json({ message: `Database connection failed: ${err.message}` });
  }
});

app.use('/api/devices', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cron', cronRoutes);

app.get('/api', (req, res) => {
  res.send('NetTrack API is running!');
});

export default app;
