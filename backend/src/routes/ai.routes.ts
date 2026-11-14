import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.middleware';
import { getAnalysis, deepReport, explainFinding, chatCyberExpert } from '../controllers/ai.controller';

const router = Router();

router.use(optionalAuth);

router.get('/:scanId', getAnalysis);
router.post('/deep-report', deepReport);
router.post('/explain-finding', explainFinding);
router.post('/chat', chatCyberExpert);

export default router;
