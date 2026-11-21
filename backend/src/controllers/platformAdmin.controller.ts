import { Response, NextFunction } from 'express';
import User from '../models/User';
import Quiz from '../models/Quiz';
import QuizAttempt from '../models/QuizAttempt';
import WalletLedger from '../models/WalletLedger';
import PaymentIntent from '../models/PaymentIntent';
import Affiliate from '../models/Affiliate';
import ReferralAttribution from '../models/ReferralAttribution';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getPlatformOverview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Platform administrator access required.' });
    const [users, quizzes, attempts, walletEntries, paymentIntents, affiliates, referrals] = await Promise.all([
      User.countDocuments(),
      Quiz.countDocuments(),
      QuizAttempt.countDocuments(),
      WalletLedger.countDocuments(),
      PaymentIntent.countDocuments(),
      Affiliate.countDocuments(),
      ReferralAttribution.countDocuments(),
    ]);
    return res.json({
      success: true,
      metrics: { users, quizzes, attempts, walletEntries, paymentIntents, affiliates, referrals },
      integrations: {
        database: Boolean(process.env.MONGODB_URI),
        jwt: Boolean(process.env.JWT_SECRET && process.env.JWT_REFRESH_SECRET),
        paystack: Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.PAYSTACK_CALLBACK_URL),
        groq: Boolean(process.env.GROQ_API_KEY),
        openai: Boolean(process.env.OPENAI_API_KEY),
        gemini: Boolean(process.env.GEMINI_API_KEY),
        publicAppUrl: Boolean(process.env.PUBLIC_APP_URL || process.env.VITE_URL),
      },
      readinessNote: 'These indicators show whether environment variables exist. They do not prove provider credentials, quotas, webhook delivery or production settlement.',
    });
  } catch (error) { next(error); }
};
export default { getPlatformOverview };
