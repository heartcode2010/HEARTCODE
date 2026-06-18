import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  tutorChat,
  scamAnalyze,
  generateCurriculum,
  generateCampaign
} from '../controllers/academy.controller';

const router = Router();

// Secure all academy endpoints with authorization guards
router.post('/tutor', authenticateToken, tutorChat);
router.post('/scam-analyze', authenticateToken, scamAnalyze);
router.post('/curriculum', authenticateToken, generateCurriculum);
router.post('/campaign', authenticateToken, generateCampaign);

export default router;
