import { Router } from 'express';
import { inspectUrl, getScanHistory, clearScanHistory, loadScanSource, runVulnerabilityScan, runAiDetect, runTechStackScan, } from '../controllers/scan.controller';
import { authenticateToken, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Allow authenticated users and guest analysts to run scans.
router.post('/inspect', optionalAuth, inspectUrl);
router.post('/vulnerability', optionalAuth, runVulnerabilityScan);
router.post('/ai-detect', optionalAuth, runAiDetect);
router.post('/tech-stack', optionalAuth, runTechStackScan);

// Keep personal history and source retrieval behind normal authentication.
router.get('/history', authenticateToken, getScanHistory);
router.delete('/history', authenticateToken, clearScanHistory);
router.get('/:scanId/source', authenticateToken, loadScanSource);

export default router;
