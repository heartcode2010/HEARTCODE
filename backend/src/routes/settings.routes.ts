import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getSettings);
router.put('/', updateSettings);
router.patch('/', updateSettings);


export default router;
