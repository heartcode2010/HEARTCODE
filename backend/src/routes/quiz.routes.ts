import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { createQuiz, listQuizzes, getQuiz, updateQuiz } from '../controllers/quiz.controller';

const router = Router();

router.post('/', authenticateToken, createQuiz);
router.get('/', authenticateToken, listQuizzes);
router.get('/:id', authenticateToken, getQuiz);
router.put('/:id', authenticateToken, updateQuiz);

export default router;
