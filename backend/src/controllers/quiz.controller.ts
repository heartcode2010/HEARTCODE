import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import Quiz from '../models/Quiz';
import QuizAttempt from '../models/QuizAttempt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const questionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  question: z.string().trim().min(5).max(1500),
  options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  correctIndex: z.number().int().min(0).max(5),
  explanation: z.string().max(1500).optional().default(''),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('easy'),
  category: z.string().trim().max(80).optional().default('general'),
}).refine((q) => q.correctIndex < q.options.length, {
  message: 'Correct answer must match one of the available options.',
  path: ['correctIndex'],
});

const quizSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().max(2000).optional().default(''),
  category: z.string().trim().max(80).optional().default('general'),
  accessMode: z.literal('free').optional().default('free'),
  price: z.literal(0).optional().default(0),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).optional().default([]),
  questions: z.array(questionSchema).min(1).max(100),
  isPublished: z.boolean().optional().default(true),
}).refine((quiz) => !quiz.questions || new Set(quiz.questions.map((question) => question.id)).size === quiz.questions.length, {
  message: 'Every quiz question must have a unique ID.',
  path: ['questions'],
});

export const createQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const parsed = quizSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Please check the quiz details and questions.', issues: parsed.error.issues });
    const quiz = await Quiz.create({ ...parsed.data, creatorId: req.user.id });
    return res.status(201).json({ success: true, quiz });
  } catch (error) { next(error); }
};

export const listQuizzes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const quizzes = await Quiz.find({ $or: [{ isPublished: true, accessMode: 'free' }, { creatorId: req.user.id }] }).sort({ createdAt: -1 }).lean();
    const safeQuizzes = quizzes.map((quiz: any) => {
      const isOwner = String(quiz.creatorId) === req.user!.id;
      if (isOwner) return { ...quiz, isOwner: true };
      return { ...quiz, isOwner: false, questions: (quiz.questions || []).map(({ id, question, options, difficulty, category }: any) => ({ id, question, options, difficulty, category })) };
    });
    return res.json({ success: true, quizzes: safeQuizzes });
  } catch (error) { next(error); }
};

export const getQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid quiz ID.' });
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const isOwner = quiz.creatorId.toString() === req.user.id;
    if ((!quiz.isPublished || quiz.accessMode !== 'free') && !isOwner) return res.status(404).json({ success: false, message: 'Quiz not found' });
    const data: any = quiz.toObject();
    data.isOwner = isOwner;
    if (!isOwner) data.questions = data.questions.map(({ id, question, options, difficulty, category }: any) => ({ id, question, options, difficulty, category }));
    return res.json({ success: true, quiz: data });
  } catch (error) { next(error); }
};

export const updateQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid quiz ID.' });
    const parsed = quizSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Please check the updated quiz fields.', issues: parsed.error.issues });
    const quiz = await Quiz.findOne({ _id: req.params.id, creatorId: req.user.id });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    Object.assign(quiz, parsed.data);
    await quiz.save();
    return res.json({ success: true, quiz });
  } catch (error) { next(error); }
};

export const submitQuizAttempt = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid quiz ID.' });
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || ((!quiz.isPublished || quiz.accessMode !== 'free') && quiz.creatorId.toString() !== req.user.id)) return res.status(404).json({ success: false, message: 'Published free quiz not found.' });
    if (!quiz.questions.length || new Set(quiz.questions.map((question: any) => question.id)).size !== quiz.questions.length) return res.status(409).json({ success: false, message: 'This quiz has invalid question data and cannot be attempted.' });
    const answerSchema = z.array(z.object({ questionId: z.string().min(1), selectedIndex: z.number().int().min(0).max(5) })).length(quiz.questions.length);
    const parsed = answerSchema.safeParse(req.body.answers);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Submit one valid answer for every question.', issues: parsed.error.issues });
    const ids = parsed.data.map(answer => answer.questionId);
    if (new Set(ids).size !== ids.length) return res.status(400).json({ success: false, message: 'Duplicate question answers are not allowed.' });
    const answerMap = new Map(parsed.data.map(answer => [answer.questionId, answer.selectedIndex]));
    const review = quiz.questions.map((question: any) => {
      const selectedIndex = answerMap.get(question.id);
      if (selectedIndex === undefined || selectedIndex >= question.options.length) return null;
      const isCorrect = selectedIndex === question.correctIndex;
      return { questionId: question.id, question: question.question, options: question.options, selectedIndex, correctIndex: question.correctIndex, isCorrect, explanation: question.explanation };
    });
    if (review.some(item => item === null)) return res.status(400).json({ success: false, message: 'Answers do not match the questions in this quiz.' });
    const score = review.filter((item: any) => item.isCorrect).length;
    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    const attempt = await QuizAttempt.create({ quizId: quiz._id, userId: req.user.id, answers: parsed.data, score, total, percentage });
    return res.status(201).json({ success: true, result: { attemptId: attempt.id, score, total, percentage, review } });
  } catch (error) { next(error); }
};

export const listMyQuizAttempts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const attempts = await QuizAttempt.find({ userId: req.user.id }).sort({ submittedAt: -1 }).limit(100).populate('quizId', 'title category').lean();
    return res.json({ success: true, attempts });
  } catch (error) { next(error); }
};

export default { createQuiz, listQuizzes, getQuiz, updateQuiz, submitQuizAttempt, listMyQuizAttempts };
