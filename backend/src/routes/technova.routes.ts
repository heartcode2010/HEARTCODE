import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getTechnovaStatus, novaChat } from '../controllers/technova.controller';

const router = Router();

// Protect the paid upstream AI key from accidental public abuse.
const novaLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'NOVA request limit reached. Please wait a minute and try again.' },
});

router.get('/status', getTechnovaStatus);
router.post('/nova', novaLimiter, novaChat);
export default router;
