import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// 从环境变量获取API密钥
const API_KEY = process.env.API_KEY;

/**
 * API密钥验证中间件
 * 验证请求头中的x-api-key是否与环境变量中配置的API_KEY匹配
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  // 从请求头获取API密钥
  const apiKey = req.headers['x-api-key'];

  // 检查API密钥是否配置
  if (!API_KEY) {
    console.error('API密钥未在环境变量中配置');
    return res.status(500).json({
      success: false,
      message: '服务器配置错误：API密钥未配置'
    });
  }

  // 验证API密钥
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'API密钥无效或缺失'
    });
  }

  // 验证通过，继续处理请求
  next();
}; 