/**
 * backend/src/routes/ai.routes.ts
 * /api/ai-detection/*
 */
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getAnalysis, deepReport, explainFinding } from '../controllers/ai.controller';

const router = Router();

router.get('/:scanId', authenticateToken, getAnalysis);
router.post('/deep-report', authenticateToken, deepReport);

// Explain specific finding
router.post('/explain-finding', authenticateToken, explainFinding);

export default router;
