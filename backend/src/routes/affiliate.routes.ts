import { Router } from 'express';
import { requireVerifiedUser } from '../middleware/platformAuth.middleware';
import { getAffiliateProfile, trackReferral, applyReferralToUser, requestPayout } from '../controllers/affiliate.controller';

const router = Router();
router.get('/me', requireVerifiedUser, getAffiliateProfile);
router.get('/track/:code', trackReferral);
router.post('/apply', requireVerifiedUser, applyReferralToUser);
router.post('/payout', requireVerifiedUser, requestPayout);
export default router;
