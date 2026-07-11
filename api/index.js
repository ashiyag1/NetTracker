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

// ─── Diagnostic endpoint — no DB needed ──────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo_uri_set: !!process.env.MONGO_URI,
    jwt_secret_set: !!process.env.JWT_SECRET,
    readyState: mongoose.connection.readyState,
    readyStateLabel: ['disconnected','connected','connecting','disconnecting'][mongoose.connection.readyState] ?? 'unknown',
    node_version: process.version,
  });
});

// ─── Proven Vercel+Mongoose connection pattern ────────────────────
// Uses global to survive warm function re-use across requests
let cached = global._mongoConn ?? { promise: null, conn: null };
global._mongoConn = cached;

async function dbConnect() {
  // Already connected and healthy
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set on Vercel');
  }

  // Prevent multiple simultaneous connection attempts
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,        // fail immediately if not connected
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected, readyState:', mongoose.connection.readyState);
  } catch (err) {
    cached.promise = null; // reset so next request retries
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

// ─── DB middleware (runs before every API route) ──────────────────
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next(); // skip for health check
  try {
    await dbConnect();
    next();
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    return res.status(500).json({ message: `Database connection failed: ${err.message}` });
  }
});

app.use('/api/devices', deviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cron', cronRoutes);

export default app;
