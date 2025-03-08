import { Request, Response } from 'express';
import { DifyService } from '../services/DifyService';

export class DifyController {
  private difyService: DifyService;

  constructor() {
    this.difyService = new DifyService();
  }

  /**
   * 生成代码
   * @param req 请求对象
   * @param res 响应对象
   */
  async generateCode(req: Request, res: Response): Promise<void> {
    try {
      const { query, conversationId, userId, inputs } = req.body;

      if (!query) {
        res.status(400).json({ error: '查询参数不能为空' });
        return;
      }

      const result = await this.difyService.generateCode(
        query,
        conversationId,
        userId,
        inputs
      );

      res.status(200).json(result);
    } catch (error) {
      console.error('生成代码时出错:', error);
      res.status(500).json({ 
        error: '处理请求时出错',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * 发送原始聊天消息
   * @param req 请求对象
   * @param res 响应对象
   */
  async sendChatMessage(req: Request, res: Response): Promise<void> {
    try {
      const chatRequest = req.body;

      if (!chatRequest.query) {
        res.status(400).json({ error: '查询参数不能为空' });
        return;
      }

      const response = await this.difyService.sendChatMessage(chatRequest);
      res.status(200).json(response);
    } catch (error) {
      console.error('发送聊天消息时出错:', error);
      res.status(500).json({ 
        error: '处理请求时出错',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
} 