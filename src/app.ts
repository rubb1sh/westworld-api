import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import walletRoutes from './routes/walletRoutes';
import difyRoutes from './routes/dify';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 检查关键环境变量
const API_KEY = process.env.API_KEY;
const TEST_WALLET_PUBLIC_KEY = process.env.TEST_WALLET_PUBLIC_KEY;
const TEST_WALLET_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY;

if (!API_KEY) {
  console.warn('警告: API_KEY 环境变量未设置，API将无法正常工作');
}

if (!TEST_WALLET_PUBLIC_KEY || !TEST_WALLET_PRIVATE_KEY) {
  console.warn('警告: 钱包密钥环境变量未设置，钱包功能将无法正常工作');
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/wallet', walletRoutes);
app.use('/api/dify', difyRoutes);

// Webhook API端点
app.post('/webhook', (req, res) => {
  console.log('收到Webhook请求:');
  console.log('请求方法:', req.method);
  console.log('请求头:', JSON.stringify(req.headers, null, 2));
  
  // 检查Content-Type
  console.log('Content-Type:', req.headers['content-type']);
  
  // 打印原始请求体
  console.log('原始请求体:', req.body);
  
  // 尝试解析不同格式的数据
  let parsedBody = req.body;
  if (typeof req.body === 'string') {
    try {
      // 尝试将字符串解析为JSON
      parsedBody = JSON.parse(req.body);
      console.log('解析后的JSON请求体:', parsedBody);
    } catch (e) {
      console.log('请求体是纯文本格式，无法解析为JSON');
    }
  }
  
  console.log('查询参数:', JSON.stringify(req.query, null, 2));
  
  // 返回成功响应
  res.status(200).json({ 
    status: 'success', 
    message: 'Webhook数据已接收并处理',
    receivedAt: new Date().toISOString(),
    contentType: req.headers['content-type'],
    method: req.method,
    bodyType: typeof req.body
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: '服务运行正常',
    apiKeyConfigured: !!API_KEY,
    walletConfigured: !!(TEST_WALLET_PUBLIC_KEY && TEST_WALLET_PRIVATE_KEY)
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`API密钥配置状态: ${API_KEY ? '已配置' : '未配置'}`);
  console.log(`钱包配置状态: ${(TEST_WALLET_PUBLIC_KEY && TEST_WALLET_PRIVATE_KEY) ? '已配置' : '未配置'}`);
});

export default app; 