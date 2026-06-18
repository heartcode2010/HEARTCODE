import { Router } from 'express';
import { exportReport } from '../controllers/report.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/export', authenticateToken, exportReport);

export default router;
