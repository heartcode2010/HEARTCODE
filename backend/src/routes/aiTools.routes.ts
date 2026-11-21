import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { generateNexoraScript, generateNexoraBrandBrief, generateEduVerseNotes } from '../controllers/aiTools.controller';

const router = Router();
router.use(authenticateToken);
router.post('/nexora/script', generateNexoraScript);
router.post('/nexora/brand-brief', generateNexoraBrandBrief);
router.post('/eduverse/notes', generateEduVerseNotes);
export default router;
