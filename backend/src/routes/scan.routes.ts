import { Router } from 'express';
import { inspectUrl, getScanHistory, clearScanHistory, loadScanSource, runVulnerabilityScan, runAiDetect, runTechStackScan, } from '../controllers/scan.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/inspect', inspectUrl);
router.post('/vulnerability', runVulnerabilityScan);
router.get('/ai-detect', runAiDetect);
router.get('/tech-stack', runTechStackScan);
router.get('/history', getScanHistory);
router.delete('/history', clearScanHistory);
router.get('/:scanId/source', loadScanSource);

export default router;
