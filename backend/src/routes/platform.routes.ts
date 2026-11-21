import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { randomBytes } from 'crypto';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import User from '../models/User';

type SessionRequest = Request & { sessionUser?: { id: string; username: string; email?: string; role: string } };
const router = Router();

const Org = mongoose.models.TNOrganization || mongoose.model('TNOrganization', new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
  members: [{ userId: { type: Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['owner', 'admin', 'instructor', 'learner'], default: 'learner' }, joinedAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true }));

const Quiz = mongoose.models.TNQuiz || mongoose.model('TNQuiz', new Schema({
  ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
  organizationId: { type: Schema.Types.ObjectId, default: null, index: true },
  title: { type: String, required: true, maxlength: 140 },
  subject: { type: String, default: 'General', maxlength: 80 },
  durationMinutes: { type: Number, min: 1, max: 180, default: 10 },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  questions: [{
    prompt: { type: String, required: true, maxlength: 2000 },
    options: [{ type: String, maxlength: 500 }],
    correctIndex: { type: Number, required: true, min: 0, max: 5 },
    explanation: { type: String, maxlength: 2000 },
  }],
}, { timestamps: true }));

const Attempt = mongoose.models.TNQuizAttempt || mongoose.model('TNQuizAttempt', new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'TNQuiz', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  answers: [{ questionIndex: Number, selectedIndex: Number }],
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true }));

const Payment = mongoose.models.TNPayment || mongoose.model('TNPayment', new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true }, reference: { type: String, required: true, unique: true },
  amountKobo: { type: Number, required: true, min: 100000 }, currency: { type: String, enum: ['NGN'], default: 'NGN' },
  purpose: { type: String, enum: ['wallet_topup'], default: 'wallet_topup' }, status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  authorizationUrl: String, providerReference: String, verifiedAt: Date,
}, { timestamps: true }));

const WalletEntry = mongoose.models.TNWalletEntry || mongoose.model('TNWalletEntry', new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true }, direction: { type: String, enum: ['credit', 'debit'], required: true },
  amountKobo: { type: Number, required: true, min: 1 }, currency: { type: String, enum: ['NGN'], default: 'NGN' },
  sourceReference: { type: String, required: true, unique: true }, description: { type: String, required: true },
}, { timestamps: true }));

const FeatureFlag = mongoose.models.TNFeatureFlag || mongoose.model('TNFeatureFlag', new Schema({
  key: { type: String, required: true, unique: true }, label: { type: String, required: true }, enabled: { type: Boolean, default: false }, updatedBy: Schema.Types.ObjectId,
}, { timestamps: true }));

const Audit = mongoose.models.TNAuditEvent || mongoose.model('TNAuditEvent', new Schema({
  actorId: { type: Schema.Types.ObjectId, required: true, index: true },
  action: { type: String, required: true },
  resourceType: String,
  resourceId: String,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now, index: true },
}, { versionKey: false }));

function requireSession(req: SessionRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : '';
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return res.status(401).json({ success: false, message: 'A valid TECHNOVA account session is required.' });
  try {
    const decoded = jwt.verify(token, secret) as { id?: string; username?: string; email?: string; role?: string };
    if (!decoded.id || !mongoose.isValidObjectId(decoded.id)) return res.status(401).json({ success: false, message: 'Invalid account session.' });
    req.sessionUser = { id: decoded.id, username: decoded.username || 'Member', email: decoded.email, role: decoded.role || 'user' };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has expired. Sign in again.' });
  }
}
async function verifyPaystack(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY || '';
  if (!secret) throw new Error('Paystack is not configured on this server.');
  const response = await axios.get('https://api.paystack.co/transaction/verify/' + encodeURIComponent(reference), {
    headers: { Authorization: 'Bearer ' + secret }, timeout: 15000,
  });
  return response.data?.data;
}

router.use(requireSession);

const orgInput = z.object({ name: z.string().trim().min(2).max(100) });
const quizInput = z.object({
  title: z.string().trim().min(3).max(140),
  subject: z.string().trim().max(80).optional(),
  durationMinutes: z.number().int().min(1).max(180).default(10),
  questions: z.array(z.object({
    prompt: z.string().trim().min(3).max(2000),
    options: z.array(z.string().trim().min(1).max(500)).min(2).max(6),
    correctIndex: z.number().int().min(0).max(5),
    explanation: z.string().max(2000).optional(),
  }).refine((question) => question.correctIndex < question.options.length, { message: 'Correct option must exist in the question options.', path: ['correctIndex'] })).min(1).max(100),
});

async function audit(actorId: string, action: string, resourceType?: string, resourceId?: string) {
  await Audit.create({ actorId, action, resourceType, resourceId });
}

router.get('/overview', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.sessionUser!.id;
    const [organizations, quizzes, attempts] = await Promise.all([
      Org.countDocuments({ $or: [{ ownerId: userId }, { 'members.userId': userId }] }),
      Quiz.countDocuments({ ownerId: userId, status: { $ne: 'archived' } }),
      Attempt.countDocuments({ userId }),
    ]);
    res.json({ success: true, overview: { organizations, quizzes, attempts, activeVerses: ['CyberVerse', 'QuizVerse'], platform: 'TECHNOVA OS' } });
  } catch (error) { next(error); }
});

router.get('/organizations', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const items = await Org.find({ $or: [{ ownerId: req.sessionUser!.id }, { 'members.userId': req.sessionUser!.id }] }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, organizations: items });
  } catch (error) { next(error); }
});

router.post('/organizations', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = orgInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Enter an organization name between 2 and 100 characters.' });
    const base = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'organization';
    const slug = base + '-' + new mongoose.Types.ObjectId().toString().slice(-6);
    const organization = await Org.create({ name: parsed.data.name, slug, ownerId: req.sessionUser!.id, members: [{ userId: req.sessionUser!.id, role: 'owner' }] });
    await audit(req.sessionUser!.id, 'organization.created', 'organization', organization.id);
    res.status(201).json({ success: true, organization });
  } catch (error) { next(error); }
});

router.get('/quizverse/quizzes', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const items = await Quiz.find({ ownerId: req.sessionUser!.id, status: { $ne: 'archived' } }).sort({ updatedAt: -1 }).lean();
    res.json({ success: true, quizzes: items });
  } catch (error) { next(error); }
});

router.post('/organizations/:organizationId/members', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.isValidObjectId(req.params.organizationId)) return res.status(400).json({ success: false, message: 'Invalid organization ID.' });
    const parsed = z.object({ identifier: z.string().trim().min(3).max(254), role: z.enum(['admin', 'instructor', 'learner']).default('learner') }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Provide an existing username or email and a valid member role.' });
    const organization = await Org.findById(req.params.organizationId);
    if (!organization) return res.status(404).json({ success: false, message: 'Organization not found.' });
    const actor = organization.members.find((member: any) => member.userId.toString() === req.sessionUser!.id);
    if (!actor || !['owner', 'admin'].includes(actor.role)) return res.status(403).json({ success: false, message: 'Only organization owners and admins can add members.' });
    const identifier = parsed.data.identifier.toLowerCase();
    const member = await User.findOne({ $or: [{ username: parsed.data.identifier }, { email: identifier }] }).select('_id username email');
    if (!member) return res.status(404).json({ success: false, message: 'No existing TECHNOVA account matches that username or email.' });
    if (organization.members.some((entry: any) => entry.userId.toString() === member._id.toString())) return res.status(409).json({ success: false, message: 'This account is already a member.' });
    organization.members.push({ userId: member._id, role: parsed.data.role } as any);
    await organization.save();
    await audit(req.sessionUser!.id, 'organization.member.added', 'organization', organization.id);
    res.status(201).json({ success: true, message: 'Member added to the organization.', member: { id: member._id, username: member.username, email: member.email, role: parsed.data.role } });
  } catch (error) { next(error); }
});

router.delete('/organizations/:organizationId/members/:memberId', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.isValidObjectId(req.params.organizationId) || !mongoose.isValidObjectId(req.params.memberId)) return res.status(400).json({ success: false, message: 'Invalid organization or member ID.' });
    const organization = await Org.findById(req.params.organizationId);
    if (!organization) return res.status(404).json({ success: false, message: 'Organization not found.' });
    const actor = organization.members.find((member: any) => member.userId.toString() === req.sessionUser!.id);
    if (!actor || !['owner', 'admin'].includes(actor.role)) return res.status(403).json({ success: false, message: 'Only organization owners and admins can remove members.' });
    const target = organization.members.find((member: any) => member.userId.toString() === req.params.memberId);
    if (!target) return res.status(404).json({ success: false, message: 'Organization member not found.' });
    if (target.role === 'owner') return res.status(403).json({ success: false, message: 'The organization owner cannot be removed.' });
    organization.members = organization.members.filter((member: any) => member.userId.toString() !== req.params.memberId) as any;
    await organization.save();
    await audit(req.sessionUser!.id, 'organization.member.removed', 'organization', organization.id);
    res.json({ success: true, message: 'Member removed.' });
  } catch (error) { next(error); }
});

router.post('/quizverse/quizzes', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = quizInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Check the quiz title and question fields.', issues: parsed.error.issues });
    const quiz = await Quiz.create({ ...parsed.data, ownerId: req.sessionUser!.id });
    await audit(req.sessionUser!.id, 'quiz.created', 'quiz', quiz.id);
    res.status(201).json({ success: true, quiz });
  } catch (error) { next(error); }
});

router.post('/quizverse/quizzes/:quizId/attempts', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.isValidObjectId(req.params.quizId)) return res.status(400).json({ success: false, message: 'Invalid quiz ID.' });
    const quiz = await Quiz.findOne({ _id: req.params.quizId, status: 'published' }).lean();
    if (!quiz) return res.status(404).json({ success: false, message: 'Published quiz not found.' });
    const submitted = z.array(z.number().int().min(0).max(5)).safeParse(req.body.answers);
    if (!submitted.success || submitted.data.length !== quiz.questions.length) return res.status(400).json({ success: false, message: 'Submit one selected option for each question.' });
    const answers = submitted.data.map((selectedIndex, questionIndex) => ({ questionIndex, selectedIndex }));
    const score = answers.reduce((total, answer) => total + (quiz.questions[answer.questionIndex].correctIndex === answer.selectedIndex ? 1 : 0), 0);
    const attempt = await Attempt.create({ quizId: quiz._id, userId: req.sessionUser!.id, score, total: quiz.questions.length, answers });
    await audit(req.sessionUser!.id, 'quiz.attempt.submitted', 'quiz', quiz.id);
    res.status(201).json({ success: true, result: { score, total: quiz.questions.length, percentage: Math.round(score / quiz.questions.length * 100), attemptId: attempt.id } });
  } catch (error) { next(error); }
});

router.get('/quizverse/attempts', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const attempts = await Attempt.find({ userId: req.sessionUser!.id }).sort({ submittedAt: -1 }).limit(50).populate('quizId', 'title subject').lean();
    res.json({ success: true, attempts });
  } catch (error) { next(error); }
});

router.post('/commerce/paystack/initialize', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const parsed = z.object({ amountNaira: z.number().int().min(1000).max(5000000) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Wallet top-ups must be between ₦1,000 and ₦5,000,000.' });
    if (!req.sessionUser!.email) return res.status(400).json({ success: false, message: 'Add a verified email address to your account before making a payment.' });
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    if (!secret) return res.status(503).json({ success: false, message: 'Paystack is not configured yet. Add PAYSTACK_SECRET_KEY to the server environment.' });
    const reference = 'tn_' + Date.now() + '_' + randomBytes(6).toString('hex');
    const amountKobo = parsed.data.amountNaira * 100;
    const payment = await Payment.create({ userId: req.sessionUser!.id, reference, amountKobo, currency: 'NGN', purpose: 'wallet_topup', status: 'pending' });
    try {
      const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email: req.sessionUser!.email, amount: amountKobo, currency: 'NGN', reference,
        callback_url: process.env.PAYSTACK_CALLBACK_URL || undefined,
        metadata: { userId: req.sessionUser!.id, purpose: 'wallet_topup', paymentId: payment.id },
      }, { headers: { Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json' }, timeout: 15000 });
      const authorizationUrl = response.data?.data?.authorization_url;
      if (!authorizationUrl) throw new Error('Paystack did not return a checkout URL.');
      payment.authorizationUrl = authorizationUrl;
      await payment.save();
      res.status(201).json({ success: true, reference, authorizationUrl, amountNaira: parsed.data.amountNaira, currency: 'NGN' });
    } catch (error) {
      payment.status = 'failed'; await payment.save(); throw error;
    }
  } catch (error) { next(error); }
});

router.get('/commerce/paystack/verify/:reference', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const payment = await Payment.findOne({ reference: req.params.reference, userId: req.sessionUser!.id });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment reference not found for this account.' });
    if (payment.status === 'success') return res.json({ success: true, credited: true, amountNaira: payment.amountKobo / 100, message: 'This payment has already been credited.' });
    const verified = await verifyPaystack(payment.reference);
    if (!verified || verified.status !== 'success' || Number(verified.amount) !== payment.amountKobo || verified.currency !== 'NGN') {
      return res.status(400).json({ success: false, credited: false, message: 'Payment is not yet confirmed by Paystack. Try verification again shortly.' });
    }
    try {
      await WalletEntry.create({ userId: payment.userId, direction: 'credit', amountKobo: payment.amountKobo, currency: 'NGN', sourceReference: payment.reference, description: 'Paystack wallet top-up' });
    } catch (error: any) {
      if (error?.code !== 11000) throw error;
    }
    payment.status = 'success'; payment.verifiedAt = new Date(); payment.providerReference = String(verified.id || '');
    await payment.save();
    await audit(req.sessionUser!.id, 'wallet.topup.verified', 'payment', payment.id);
    res.json({ success: true, credited: true, amountNaira: payment.amountKobo / 100, message: 'Payment verified and wallet credited.' });
  } catch (error) { next(error); }
});

router.get('/credits', (_req: SessionRequest, res: Response) => {
  res.json({ success: true, status: 'not_configured', balance: null, message: 'AI credit packages and metered usage are not enabled yet.' });
});

router.get('/wallet', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.sessionUser!.id);
    const totals = await WalletEntry.aggregate([{ $match: { userId } }, { $group: { _id: '$direction', total: { $sum: '$amountKobo' } } }]);
    const credits = totals.find((x: any) => x._id === 'credit')?.total || 0;
    const debits = totals.find((x: any) => x._id === 'debit')?.total || 0;
    res.json({ success: true, currency: 'NGN', balanceKobo: credits - debits, balanceNaira: (credits - debits) / 100 });
  } catch (error) { next(error); }
});

router.get('/wallet/transactions', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    const entries = await WalletEntry.find({ userId: req.sessionUser!.id }).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ success: true, transactions: entries.map((entry: any) => ({ direction: entry.direction, amountNaira: entry.amountKobo / 100, currency: entry.currency, description: entry.description, reference: entry.sourceReference, createdAt: entry.createdAt })) });
  } catch (error) { next(error); }
});

router.get('/admin/overview', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    if (req.sessionUser!.role !== 'admin') return res.status(403).json({ success: false, message: 'Platform administrator access required.' });
    const [users, organizations, quizzes, attempts, payments, walletEntries, flags] = await Promise.all([
      User.countDocuments(), Org.countDocuments(), Quiz.countDocuments(), Attempt.countDocuments(), Payment.countDocuments(), WalletEntry.countDocuments(), FeatureFlag.find().sort({ key: 1 }).lean(),
    ]);
    res.json({ success: true, metrics: { users, organizations, quizzes, attempts, payments, walletEntries }, integrations: {
      database: Boolean(process.env.MONGODB_URI), jwt: Boolean(process.env.JWT_SECRET), paystack: Boolean(process.env.PAYSTACK_SECRET_KEY),
      groq: Boolean(process.env.GROQ_API_KEY), gemini: Boolean(process.env.GEMINI_API_KEY), openai: Boolean(process.env.OPENAI_API_KEY),
    }, featureFlags: flags });
  } catch (error) { next(error); }
});

router.put('/admin/feature-flags/:key', async (req: SessionRequest, res: Response, next: NextFunction) => {
  try {
    if (req.sessionUser!.role !== 'admin') return res.status(403).json({ success: false, message: 'Platform administrator access required.' });
    if (!/^[a-z0-9][a-z0-9._-]{1,60}$/i.test(req.params.key)) return res.status(400).json({ success: false, message: 'Invalid feature flag key.' });
    const parsed = z.object({ label: z.string().trim().min(2).max(100), enabled: z.boolean() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'A label and enabled state are required.' });
    const flag = await FeatureFlag.findOneAndUpdate({ key: req.params.key }, { ...parsed.data, updatedBy: req.sessionUser!.id }, { upsert: true, new: true, runValidators: true });
    await audit(req.sessionUser!.id, 'platform.feature_flag.updated', 'feature_flag', flag.id);
    res.json({ success: true, featureFlag: flag });
  } catch (error) { next(error); }
});

router.get('/affiliate', (_req: SessionRequest, res: Response) => {
  res.json({ success: true, status: 'not_configured', message: 'Affiliate attribution and commission payouts are not enabled yet.' });
});

export default router;
