import { Router } from 'express';
import { requireVerifiedUser } from '../middleware/platformAuth.middleware';
import { createQuiz, listQuizzes, getQuiz, updateQuiz, submitQuizAttempt, listMyQuizAttempts } from '../controllers/quiz.controller';

const router = Router();
router.use(requireVerifiedUser);
router.post('/', createQuiz);
router.get('/', listQuizzes);
router.get('/attempts/me', listMyQuizAttempts);
router.get('/:id', getQuiz);
router.post('/:id/attempts', submitQuizAttempt);
router.put('/:id', updateQuiz);
export default router;
