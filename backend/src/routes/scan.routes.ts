import { Router } from 'express';
import { inspectUrl, getScanHistory, clearScanHistory, loadScanSource, runScan } from '../controllers/scan.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(optionalAuth);

router.post('/inspect', inspectUrl);
router.post('/run', runScan);
router.get('/history', getScanHistory);
router.delete('/history', clearScanHistory);
router.get('/:scanId/source', loadScanSource);

export default router;
