import { Response, NextFunction } from 'express';
import Affiliate from '../models/Affiliate';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

const createReferralCode = (username: string) => {
  const slug = username.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 8);
  return `${slug}${crypto.randomBytes(2).toString('hex')}`;
};

export const getAffiliateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    let affiliate = await Affiliate.findOne({ userId: req.user.id });
    if (!affiliate) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const referralCode = createReferralCode(user.username);
      affiliate = await Affiliate.create({
        userId: user._id,
        referralCode,
        referralLink: `${process.env.VITE_URL || 'http://localhost:5173'}/?ref=${referralCode}`,
      });
    }
    return res.json({ success: true, affiliate });
  } catch (error) {
    next(error);
  }
};

export const trackReferral = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const affiliate = await Affiliate.findOne({ referralCode: code });
    if (!affiliate) return res.status(404).json({ success: false, message: 'Referral code not found' });
    affiliate.totalClicks += 1;
    await affiliate.save();
    return res.json({ success: true, message: 'Referral tracked' });
  } catch (error) {
    next(error);
  }
};

export const applyReferralToUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Referral code required' });
    const affiliate = await Affiliate.findOne({ referralCode: code });
    if (!affiliate) return res.status(404).json({ success: false, message: 'Referral code not found' });
    affiliate.registeredReferrals += 1;
    affiliate.activeReferrals += 1;
    await affiliate.save();
    return res.json({ success: true, message: 'Referral applied', affiliate });
  } catch (error) {
    next(error);
  }
};

export const requestPayout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const affiliate = await Affiliate.findOne({ userId: req.user.id });
    if (!affiliate) return res.status(404).json({ success: false, message: 'Affiliate profile not found' });
    const { amount, method } = req.body;
    if (!amount || amount < affiliate.minimumPayout) {
      return res.status(400).json({ success: false, message: `Minimum payout is ${affiliate.minimumPayout}` });
    }
    affiliate.withdrawals.push({ amount, method, status: 'pending' });
    affiliate.pendingBalance += amount;
    affiliate.availableBalance -= amount;
    await affiliate.save();
    return res.json({ success: true, message: 'Payout requested', affiliate });
  } catch (error) {
    next(error);
  }
};

export default { getAffiliateProfile, trackReferral, applyReferralToUser, requestPayout };
