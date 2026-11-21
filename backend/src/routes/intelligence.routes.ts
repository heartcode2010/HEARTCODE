import { Router } from 'express';
import {
  runFullScan,
  runSurfaceScan,
  runDeepRecon,
  getInfrastructureMap,
  getBehavioralProfile,
  getAIForensics,
  getThreatRadar,
  getReputationScores,
  getDNAProfile,
  getIntelligenceReportDetails,
  getTimelineEvents,
} from '../controllers/intelligence.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all intelligence endpoints
router.use(authenticateToken);

router.post('/full-scan', runFullScan);
router.post('/surface-scan', runSurfaceScan);
router.post('/deep-recon', runDeepRecon);
router.post('/infrastructure', getInfrastructureMap);
router.post('/behavioral', getBehavioralProfile);
router.post('/ai-forensics', getAIForensics);
router.post('/threat-radar', getThreatRadar);
router.post('/reputation', getReputationScores);
router.post('/dna-profile', getDNAProfile);
router.get('/report/:scanId', getIntelligenceReportDetails);
router.get('/timeline/:scanId', getTimelineEvents);

export default router;
