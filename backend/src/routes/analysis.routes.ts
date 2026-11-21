import { Router } from 'express';
import { runScan, runAIDeepAnalysis } from '../controllers/scan.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/run', runScan);
router.post('/ai-deep', runAIDeepAnalysis);

export default router;
