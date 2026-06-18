import { Router } from 'express';
import { inspectUrl, getScanHistory, clearScanHistory, loadScanSource } from '../controllers/scan.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/inspect', inspectUrl);
router.get('/history', getScanHistory);
router.delete('/history', clearScanHistory);
router.get('/:scanId/source', loadScanSource);

export default router;
