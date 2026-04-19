import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookingRoutes from '../src/routes/bookings';
import contentRoutes from '../src/routes/content';
import leadRoutes from '../src/routes/leads';
import uploadRoutes from '../src/routes/uploads';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Backend is Live!</h1><p>Visit /api/health for status.</p>');
});
app.get('/api', (req, res) => {
  res.send('<h1>Portfolio API is Live on Vercel!</h1><p>Visit /api/health for status.</p>');
});
app.use('/api/bookings', bookingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    message: 'Backend is running on Vercel',
    database: isConnected ? 'connected' : 'disconnected',
    email: {
      configured: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS),
      user: process.env.GMAIL_USER ? `${process.env.GMAIL_USER.substring(0, 3)}***` : 'NOT SET',
    },
  });
});

// ---------- MongoDB Connection Caching for Serverless ----------
// In serverless, each invocation may reuse a "warm" container.
// We cache the connection promise so we don't open new connections every request.
let cachedConnection: typeof mongoose | null = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const MONGODB_URI = process.env.MONGODB_URI || '';
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  cachedConnection = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  console.log('✅ Connected to MongoDB');
  return cachedConnection;
}

// Wrap the Express app to ensure DB is connected before handling requests
const handler = async (req: any, res: any) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    return res.status(500).json({ error: 'Database connection failed' });
  }
  return app(req, res);
};

export default handler;
