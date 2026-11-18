import { Response, NextFunction } from 'express';
import Quiz from '../models/Quiz';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const quiz = await Quiz.create({
      ...req.body,
      creatorId: req.user.id,
    });
    return res.status(201).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

export const listQuizzes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true }).sort({ createdAt: -1 });
    return res.json({ success: true, quizzes });
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    return res.json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const quiz = await Quiz.findOne({ _id: req.params.id, creatorId: req.user.id });
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    Object.assign(quiz, req.body);
    await quiz.save();
    return res.json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

export default { createQuiz, listQuizzes, getQuiz, updateQuiz };
