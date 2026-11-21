import { Response, NextFunction } from 'express';
import { z } from 'zod';
import Affiliate from '../models/Affiliate';
import ReferralAttribution from '../models/ReferralAttribution';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

const createReferralCode = (username: string) => {
  const slug = username.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 8) || 'member';
  return slug + crypto.randomBytes(3).toString('hex');
};

export const getAffiliateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    let affiliate = await Affiliate.findOne({ userId: req.user.id });
    if (!affiliate) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const referralCode = createReferralCode(user.username);
      const publicUrl = (process.env.PUBLIC_APP_URL || process.env.VITE_URL || '').replace(/\/$/, '');
      affiliate = await Affiliate.create({
        userId: user._id,
        referralCode,
        referralLink: publicUrl + '/?ref=' + referralCode,
        commissionRate: 0.2,
      });
    }
    const [attributedCount, attributionRows] = await Promise.all([
      ReferralAttribution.countDocuments({ affiliateId: affiliate._id }),
      ReferralAttribution.find({ affiliateId: affiliate._id }).sort({ attributedAt: -1 }).limit(20).populate('referredUserId', 'username createdAt').lean(),
    ]);
    return res.json({
      success: true,
      affiliate: { ...affiliate.toObject(), registeredReferrals: attributedCount },
      recentReferrals: attributionRows,
      commissionNote: 'The referral attribution is recorded. Commission earnings are only posted after eligible paid purchases are connected to the ledger.',
    });
  } catch (error) { next(error); }
};

export const trackReferral = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const code = String(req.params.code || '').trim();
    const affiliate = await Affiliate.findOne({ referralCode: code, status: 'active' }).select('_id');
    if (!affiliate) return res.status(404).json({ success: false, message: 'Referral code not found' });
    await Affiliate.updateOne({ _id: affiliate._id }, { $inc: { totalClicks: 1 } });
    return res.json({ success: true, message: 'Referral visit recorded' });
  } catch (error) { next(error); }
};

export const applyReferralToUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const parsed = z.object({ code: z.string().trim().min(3).max(40) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'A valid referral code is required.' });
    const affiliate = await Affiliate.findOne({ referralCode: parsed.data.code, status: 'active' });
    if (!affiliate) return res.status(404).json({ success: false, message: 'Referral code not found or inactive.' });
    if (affiliate.userId.toString() === req.user.id) return res.status(400).json({ success: false, message: 'You cannot apply your own referral code.' });
    const user = await User.findById(req.user.id).select('createdAt');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const ageHours = (Date.now() - new Date(user.createdAt).getTime()) / 3600000;
    if (ageHours > 24) return res.status(409).json({ success: false, message: 'Referral attribution can only be applied within 24 hours of account creation.' });
    const existing = await ReferralAttribution.findOne({ referredUserId: user._id });
    if (existing) return res.status(409).json({ success: false, message: 'A referral has already been applied to this account.' });
    try {
      await ReferralAttribution.create({ affiliateId: affiliate._id, referredUserId: user._id, referralCode: affiliate.referralCode });
    } catch (error: any) {
      if (error?.code === 11000) return res.status(409).json({ success: false, message: 'A referral has already been applied to this account.' });
      throw error;
    }
    await Affiliate.updateOne({ _id: affiliate._id }, { $inc: { registeredReferrals: 1, activeReferrals: 1 } });
    return res.json({ success: true, message: 'Referral successfully linked to your new account.' });
  } catch (error) { next(error); }
};

export const requestPayout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const affiliate = await Affiliate.findOne({ userId: req.user.id, status: 'active' });
    if (!affiliate) return res.status(404).json({ success: false, message: 'Affiliate profile not found or inactive' });
    const parsed = z.object({ amount: z.number().int().min(1), method: z.string().trim().min(3).max(60) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Enter a valid payout amount and payout method.' });
    if (parsed.data.amount < affiliate.minimumPayout) return res.status(400).json({ success: false, message: 'Minimum payout is ₦' + affiliate.minimumPayout.toLocaleString() });
    if (parsed.data.amount > affiliate.availableBalance) return res.status(400).json({ success: false, message: 'Insufficient available affiliate earnings.' });
    affiliate.withdrawals.push({ amount: parsed.data.amount, method: parsed.data.method, status: 'pending', requestedAt: new Date() });
    affiliate.pendingBalance += parsed.data.amount;
    affiliate.availableBalance -= parsed.data.amount;
    await affiliate.save();
    return res.json({ success: true, message: 'Payout request submitted for administrator review.', affiliate });
  } catch (error) { next(error); }
};

export default { getAffiliateProfile, trackReferral, applyReferralToUser, requestPayout };
