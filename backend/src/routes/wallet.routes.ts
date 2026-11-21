import { Router } from 'express';
import { requireVerifiedUser } from '../middleware/platformAuth.middleware';
import { getWalletOverview, getWalletTransactions, initializeWalletDeposit, verifyWalletDeposit } from '../controllers/wallet.controller';

const router = Router();
router.use(requireVerifiedUser);
router.get('/me', getWalletOverview);
router.get('/transactions', getWalletTransactions);
router.post('/deposit/initialize', initializeWalletDeposit);
router.get('/deposit/verify/:reference', verifyWalletDeposit);
export default router;
