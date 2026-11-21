import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

type SessionRequest = Request & { sessionUser?: { id: string; username: string; role: string } };
const router = Router();

const Org = mongoose.models.TNOrganization || mongoose.model('TNOrganization', new Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  ownerId: { type: Schema.Types.ObjectId, required: true, index: true },
  members: [{ userId: Schema.Types.ObjectId, role: { type: String, enum: ['owner', 'admin', 'instructor', 'learner'], default: 'learner' }, joinedAt: { type: Date, default: Date.now } }],
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
    const decoded = jwt.verify(token, secret) as { id?: string; username?: string; role?: string };
    if (!decoded.id || !mongoose.isValidObjectId(decoded.id)) return res.status(401).json({ success: false, message: 'Invalid account session.' });
    req.sessionUser = { id: decoded.id, username: decoded.username || 'Member', role: decoded.role || 'user' };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Your session has expired. Sign in again.' });
  }
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

router.get('/credits', (_req: SessionRequest, res: Response) => {
  res.json({ success: true, status: 'not_configured', balance: null, message: 'AI credit purchases and usage will appear after the billing ledger and payment-provider verification are enabled.' });
});

router.get('/wallet', (_req: SessionRequest, res: Response) => {
  res.json({ success: true, status: 'not_configured', balance: null, currency: 'NGN', message: 'Wallet balances are unavailable until verified payment processing and the immutable ledger are configured.' });
});

router.get('/affiliate', (_req: SessionRequest, res: Response) => {
  res.json({ success: true, status: 'not_configured', message: 'Affiliate attribution and commission payouts are not enabled yet.' });
});

export default router;
