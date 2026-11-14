import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Scan from '../models/Scan';
import Vulnerability from '../models/Vulnerability';
import os from 'os';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aniebietabasienobong@gmail.com';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'heartcode_admin_9f8e7d6c5b4a3210';

export const verifyAdminAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const secretKey = req.headers['x-admin-key'];
  if (secretKey && secretKey === ADMIN_SECRET) {
    return next();
  }

  if (req.user && (req.user.role === 'admin' || req.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Restricted: Administrator credentials or security authorization key required.',
  });
};

export const getAdminMetrics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalScans, totalVulnerabilities] = await Promise.all([
      User.countDocuments(),
      Scan.countDocuments(),
      Vulnerability.countDocuments(),
    ]);

    const recentScans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('url userId size lines tagsCount scriptsCount createdAt');

    const systemTelemetry = {
      platform: os.platform(),
      release: os.release(),
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
      freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
      cpus: os.cpus().length,
      nodeVersion: process.version,
    };

    const apiProviders = [
      { name: 'VirusTotal API', keySet: !!process.env.VIRUSTOTAL_API_KEY, status: 'Active' },
      { name: 'Shodan Cyber Intel', keySet: !!process.env.SHODAN_API_KEY, status: 'Active' },
      { name: 'BuiltWith Stack Engine', keySet: !!process.env.BUILTWITH_API_KEY, status: 'Active' },
      { name: 'OpenAI Security GPT', keySet: !!process.env.OPENAI_API_KEY, status: 'Active' },
      { name: 'Google Gemini Pro', keySet: !!process.env.GEMINI_API_KEY, status: 'Active' },
      { name: 'Groq Realtime Inference', keySet: !!process.env.GROQ_API_KEY, status: 'Active' },
      { name: 'SecurityTrails DNS', keySet: !!process.env.SECURITYTRAILS_API_KEY, status: 'Active' },
    ];

    return res.json({
      success: true,
      adminEmail: ADMIN_EMAIL,
      metrics: {
        totalUsers,
        totalScans,
        totalVulnerabilities,
        dailyScanLimit: parseInt(process.env.DAILY_SCAN_LIMIT || '5', 10),
      },
      system: systemTelemetry,
      apis: apiProviders,
      recentScans,
    });
  } catch (error) {
    next(error);
  }
};

export const clearAllTelemetry = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await Promise.all([
      Scan.deleteMany({}),
      Vulnerability.deleteMany({}),
    ]);

    return res.json({
      success: true,
      message: 'All system scan logs and vulnerability records purged successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export default { verifyAdminAccess, getAdminMetrics, clearAllTelemetry };

