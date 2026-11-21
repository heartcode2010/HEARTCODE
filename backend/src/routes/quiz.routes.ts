import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { createQuiz, listQuizzes, getQuiz, updateQuiz, submitQuizAttempt, listMyQuizAttempts } from '../controllers/quiz.controller';

const router = Router();

router.post('/', authenticateToken, createQuiz);
router.get('/', authenticateToken, listQuizzes);
router.get('/attempts/me', authenticateToken, listMyQuizAttempts);
router.get('/:id', authenticateToken, getQuiz);
router.post('/:id/attempts', authenticateToken, submitQuizAttempt);
router.put('/:id', authenticateToken, updateQuiz);

export default router;
