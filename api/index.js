import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns';
import dotenv from 'dotenv';

import deviceRoutes from '../Backend/routes/deviceRoutes.js';
import authRoutes from '../Backend/routes/authRoutes.js';
import cronRoutes from '../Backend/routes/cronRoutes.js';

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(cors());
app.use(express.json());

// Reuse MongoDB connection across serverless invocations
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}
connectDB().catch(console.error);

app.use('/api/devices', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cron', cronRoutes);

app.get('/api', (req, res) => {
  res.send('NetTrack API is running!');
});

export default app;
