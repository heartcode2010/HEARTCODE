import { Router } from 'express';
import { requireVerifiedUser } from '../middleware/platformAuth.middleware';
import { generateNexoraScript, generateNexoraBrandBrief, generateEduVerseNotes } from '../controllers/aiTools.controller';

const router = Router();
router.use(requireVerifiedUser);
router.post('/nexora/script', generateNexoraScript);
router.post('/nexora/brand-brief', generateNexoraBrandBrief);
router.post('/eduverse/notes', generateEduVerseNotes);
export default router;
