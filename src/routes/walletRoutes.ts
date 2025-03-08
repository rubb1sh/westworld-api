import { Router } from 'express';
import { WalletController } from '../controllers/WalletController';
import { apiKeyAuth } from '../middlewares/authMiddleware';

const router = Router();
const walletController = new WalletController();

/**
 * @route POST /api/wallet/swap
 * @desc 执行代币交换（购买或出售）
 * @access Private (需要API密钥)
 */
router.post('/swap', apiKeyAuth, walletController.executeSwap.bind(walletController));

/**
 * @route GET /api/wallet/balance
 * @desc 查询钱包余额
 * @access Private (需要API密钥)
 */
router.get('/balance', apiKeyAuth, walletController.getWalletBalance.bind(walletController));

export default router;