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
import adminRoutes from './routes/admin.routes';
import affiliateRoutes from './routes/affiliate.routes';
import quizRoutes from './routes/quiz.routes';
import walletRoutes from './routes/wallet.routes';
import aiToolsRoutes from './routes/aiTools.routes';
import platformAdminRoutes from './routes/platformAdmin.routes';
import { crawlerProtection } from './middleware/crawlerProtection.middleware';
import { errorHandler } from './middleware/error.middleware';
import { crawlerFilterMiddleware } from './middleware/crawlerFilter.middleware';

dotenv.config();

const app = express();

// Security configuration
app.use(helmet());
app.use(crawlerFilterMiddleware);

// CORS setup
const corsOptions = {
  origin: '*', // allow frontend Vite origin and dynamic requests
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Parsing JSON payloads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Anti-Crawler and External Scanner Defense Filter
app.use(crawlerProtection);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this client, please try again shortly.',
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
app.use('/api/admin', adminRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/ai-tools', aiToolsRoutes);
app.use('/api/platform-admin', platformAdminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date(), version: '2.0.0' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
