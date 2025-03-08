import { Router } from 'express';
import { DifyController } from '../controllers/DifyController';

const router = Router();
const difyController = new DifyController();

/**
 * @route POST /api/dify/generate-code
 * @desc 生成代码
 * @access Public
 */
router.post('/generate-code', (req, res) => difyController.generateCode(req, res));

/**
 * @route POST /api/dify/chat
 * @desc 发送聊天消息
 * @access Public
 */
router.post('/chat', (req, res) => difyController.sendChatMessage(req, res));

export default router; 