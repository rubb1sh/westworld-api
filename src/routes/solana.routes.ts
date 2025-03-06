import { Router } from 'express';
import { SolanaController } from '../controllers/SolanaController';

const router = Router();
const controller = new SolanaController();

router.get('/balance/:publicKey', controller.getBalance.bind(controller));
router.post('/account', controller.createAccount.bind(controller));
router.post('/airdrop', controller.requestAirdrop.bind(controller));

export default router; 