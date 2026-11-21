import { Router } from 'express';
import { getTechnovaStatus, novaChat } from '../controllers/technova.controller';

const router = Router();
router.get('/status', getTechnovaStatus);
router.post('/nova', novaChat);
export default router;
