import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import scanRoutes from './routes/scan.routes';
import vulnerabilityRoutes from './routes/vulnerability.routes';
import aiRoutes from './routes/ai.routes';
import reportRoutes from './routes/report.routes';
import settingsRoutes from './routes/settings.routes';
import intelligenceRoutes from './routes/intelligence.routes';
import academyRoutes from './routes/academy.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

// Security configuration
app.use(helmet());

// CORS setup
const corsOptions = {
  origin: process.env.VITE_URL || '*', // allow frontend Vite origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Parsing JSON payloads
app.use(express.json({ limit: '15mb' })); // support large HTML paste inputs
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use('/api/ai-detection', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/academy', academyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

export default app;
