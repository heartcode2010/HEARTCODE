import { Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import axios from 'axios';
import { z } from 'zod';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import WalletLedger from '../models/WalletLedger';
import PaymentIntent from '../models/PaymentIntent';

const getPaystackSecret = () => process.env.PAYSTACK_SECRET_KEY || '';

export const getWalletOverview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const totals = await WalletLedger.aggregate([
      { $match: { userId } },
      { $group: { _id: '$direction', totalKobo: { $sum: '$amountKobo' } } },
    ]);
    const credits = totals.find((row: any) => row._id === 'credit')?.totalKobo || 0;
    const debits = totals.find((row: any) => row._id === 'debit')?.totalKobo || 0;
    return res.json({
      success: true,
      wallet: {
        currency: 'NGN',
        balanceKobo: credits - debits,
        balance: (credits - debits) / 100,
        totalCredited: credits / 100,
        totalDebited: debits / 100,
      },
    });
  } catch (error) { next(error); }
};

export const getWalletTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const transactions = await WalletLedger.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({
      success: true,
      transactions: transactions.map((entry: any) => ({
        id: entry._id,
        direction: entry.direction,
        amount: entry.amountKobo / 100,
        currency: entry.currency,
        description: entry.description,
        reference: entry.reference,
        source: entry.source,
        createdAt: entry.createdAt,
      })),
    });
  } catch (error) { next(error); }
};

export const initializeWalletDeposit = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const parsed = z.object({ amount: z.number().int().min(1000).max(5000000) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Enter an amount between ₦1,000 and ₦5,000,000.' });
    const secret = getPaystackSecret();
    if (!secret) return res.status(503).json({ success: false, message: 'Paystack is not configured. Add PAYSTACK_SECRET_KEY to the backend environment.' });
    const user = await User.findById(req.user.id).select('email username');
    if (!user?.email) return res.status(400).json({ success: false, message: 'Add an email address to your account before funding your wallet.' });

    const reference = 'tnw_' + Date.now() + '_' + randomBytes(8).toString('hex');
    const amountKobo = parsed.data.amount * 100;
    const intent = await PaymentIntent.create({ userId: user._id, reference, amountKobo, currency: 'NGN', provider: 'paystack', status: 'pending' });
    try {
      const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || (process.env.VITE_URL ? process.env.VITE_URL.replace(/\/$/, '') + '/wallet' : undefined);
      const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email: user.email,
        amount: amountKobo,
        currency: 'NGN',
        reference,
        callback_url: callbackUrl,
        metadata: { userId: String(user._id), purpose: 'wallet_funding', paymentIntentId: String(intent._id) },
      }, {
        headers: { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json' },
        timeout: 15000,
      });
      const checkoutUrl = response.data?.data?.authorization_url;
      if (!checkoutUrl) throw new Error('Paystack did not return a checkout URL.');
      intent.checkoutUrl = checkoutUrl;
      await intent.save();
      return res.status(201).json({ success: true, reference, checkoutUrl, amount: parsed.data.amount, currency: 'NGN' });
    } catch (error) {
      intent.status = 'failed';
      await intent.save();
      throw error;
    }
  } catch (error) { next(error); }
};

export const verifyWalletDeposit = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const reference = String(req.params.reference || '');
    const intent = await PaymentIntent.findOne({ reference, userId: req.user.id });
    if (!intent) return res.status(404).json({ success: false, message: 'Payment reference not found for this account.' });
    if (intent.status === 'success') {
      return res.json({ success: true, credited: true, amount: intent.amountKobo / 100, message: 'This payment has already been credited.' });
    }
    const secret = getPaystackSecret();
    if (!secret) return res.status(503).json({ success: false, message: 'Paystack verification is not configured on the server.' });
    const response = await axios.get('https://api.paystack.co/transaction/verify/' + encodeURIComponent(reference), {
      headers: { Authorization: 'Bearer ' + secret },
      timeout: 15000,
    });
    const payment = response.data?.data;
    if (!payment || payment.status !== 'success' || Number(payment.amount) !== intent.amountKobo || payment.currency !== 'NGN' || payment.reference !== intent.reference) {
      return res.status(409).json({ success: false, credited: false, message: 'Paystack has not confirmed this payment yet. Wait briefly and try again.' });
    }
    try {
      await WalletLedger.create({
        userId: intent.userId,
        direction: 'credit',
        amountKobo: intent.amountKobo,
        currency: 'NGN',
        reference: intent.reference,
        description: 'Wallet funding via Paystack',
        source: 'paystack',
      });
    } catch (error: any) {
      if (error?.code !== 11000) throw error;
    }
    intent.status = 'success';
    intent.providerTransactionId = String(payment.id || '');
    intent.verifiedAt = new Date();
    await intent.save();
    return res.json({ success: true, credited: true, amount: intent.amountKobo / 100, message: 'Payment verified and wallet funded.' });
  } catch (error) { next(error); }
};
