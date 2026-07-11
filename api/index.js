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

// Reuse MongoDB connection across serverless invocations
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000, // fail fast if Atlas is unreachable
  });
  isConnected = true;
  console.log('MongoDB connected');
}
connectDB().catch(console.error);

app.use('/api/devices', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cron', cronRoutes);

app.get('/api', (req, res) => {
  res.send('NetTrack API is running!');
});

export default app;
