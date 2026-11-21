import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getWalletOverview, getWalletTransactions, initializeWalletDeposit, verifyWalletDeposit } from '../controllers/wallet.controller';

const router = Router();

router.use(authenticateToken);
router.get('/me', getWalletOverview);
router.get('/transactions', getWalletTransactions);
router.post('/deposit/initialize', initializeWalletDeposit);
router.get('/deposit/verify/:reference', verifyWalletDeposit);

export default router;
