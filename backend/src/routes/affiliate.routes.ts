import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getAffiliateProfile, trackReferral, applyReferralToUser, requestPayout } from '../controllers/affiliate.controller';

const router = Router();

router.get('/me', authenticateToken, getAffiliateProfile);
router.get('/track/:code', trackReferral);
router.post('/apply', authenticateToken, applyReferralToUser);
router.post('/payout', authenticateToken, requestPayout);

export default router;
