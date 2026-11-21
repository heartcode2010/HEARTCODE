import { Router } from 'express';
import { requireVerifiedUser } from '../middleware/platformAuth.middleware';
import { getPlatformOverview } from '../controllers/platformAdmin.controller';

const router = Router();
router.use(requireVerifiedUser);
router.get('/overview', getPlatformOverview);
export default router;
