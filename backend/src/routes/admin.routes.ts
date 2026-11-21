import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.middleware';
import { verifyAdminAccess, getAdminMetrics, clearAllTelemetry } from '../controllers/admin.controller';

const router = Router();

router.use(optionalAuth);
router.use(verifyAdminAccess);

router.get('/metrics', getAdminMetrics);
router.delete('/purge-telemetry', clearAllTelemetry);

export default router;

