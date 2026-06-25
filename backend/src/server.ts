import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookingRoutes from './routes/bookings';
import contentRoutes from './routes/content';
import leadRoutes from './routes/leads';
import uploadRoutes from './routes/uploads';
import path from 'path';
import fs from 'fs';
import { transporter } from './services/emailService';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Verify SMTP connection (only in non-serverless / local dev)
if (process.env.NODE_ENV !== 'production') {
  transporter.verify((error: any, success: any) => {
    if (error) {
      console.error('❌ SMTP connection failed:', error);
    } else {
      console.log('✅ SMTP server is ready to send emails');
    }
  });
}

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) ||
      /^https:\/\/myportfolio-[a-z0-9-]+\.vercel\.app$/.test(origin) ||
      /^https:\/\/myportfolio\.vercel\.app$/.test(origin);
      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Roots
app.get('/', (req, res) => {
  res.send('<h1>Portfolio API is Live!</h1><p>Visit /api/health for status.</p>');
});
app.use('/api/bookings', bookingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/upload', uploadRoutes);

// Static uploads serving
const uploadDir = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('⚠️ Could not create uploads directory (expected on Vercel):', err);
}
app.use('/uploads', express.static(uploadDir));

// Simple health check route
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    message: 'Backend is running successfully',
    database: isConnected ? 'connected' : 'disconnected',
    email: {
      configured: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS),
      user: process.env.GMAIL_USER ? `${process.env.GMAIL_USER.substring(0, 3)}***` : 'NOT SET',
    },
    replicaSet: isConnected ? (mongoose.connection as any).db?.databaseName : null,
    host: isConnected ? (mongoose.connection as any).host : null
  });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend successfully listening on port ${PORT}`);
});

