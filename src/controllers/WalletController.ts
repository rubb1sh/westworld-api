import { Request, Response } from 'express';
import { SwapService } from '../services/SwapService';
import { SolanaService } from '../services/SolanaService';
import dotenv from 'dotenv';

dotenv.config();

// 从环境变量获取测试钱包的私钥和公钥
const TEST_WALLET_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY || '';
const TEST_WALLET_PUBLIC_KEY = process.env.TEST_WALLET_PUBLIC_KEY || '';

export class WalletController {
    private swapService: SwapService;
    private solanaService: SolanaService;

    constructor() {
        this.swapService = new SwapService();
        this.solanaService = new SolanaService();
    }

    /**
     * 执行代币交换（购买或出售）
     * @param req 请求对象
     * @param res 响应对象
     */
    async executeSwap(req: Request, res: Response) {
        try {
            const { inputMint, outputMint, amount, slippage = 1, action } = req.body;

            // 验证必要参数
            if (!inputMint || !outputMint || !amount) {
                return res.status(400).json({
                    success: false,
                    message: '缺少必要参数：inputMint, outputMint, amount'
                });
            }

            // 验证操作类型
            if (action && !['buy', 'sell'].includes(action)) {
                return res.status(400).json({
                    success: false,
                    message: '操作类型无效，必须是 "buy" 或 "sell"'
                });
            }

            // 检查私钥是否配置
            if (!TEST_WALLET_PRIVATE_KEY) {
                return res.status(500).json({
                    success: false,
                    message: '钱包私钥未配置'
                });
            }

            // 执行交换
            const result = await this.swapService.executeSwapWithPrivateKey(
                TEST_WALLET_PRIVATE_KEY,
                inputMint,
                outputMint,
                amount,
                slippage
            );

            return res.status(200).json({
                success: true,
                data: result,
                message: `代币${action === 'buy' ? '购买' : '出售'}成功`
            });
        } catch (error) {
            console.error('代币交换API错误:', error);
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            return res.status(500).json({
                success: false,
                message: `代币交换失败: ${errorMessage}`
            });
        }
    }

    /**
     * 查询钱包余额
     * @param req 请求对象
     * @param res 响应对象
     */
    async getWalletBalance(req: Request, res: Response) {
        try {
            // 检查公钥是否配置
            if (!TEST_WALLET_PUBLIC_KEY) {
                return res.status(500).json({
                    success: false,
                    message: '钱包公钥未配置'
                });
            }

            // 获取SOL余额
            const solBalance = await this.solanaService.getBalance(TEST_WALLET_PUBLIC_KEY);

            // 获取代币余额（如果请求中指定了代币）
            const { tokenMint } = req.query;
            let tokenBalance = null;

            if (tokenMint && typeof tokenMint === 'string') {
                tokenBalance = await this.swapService.getTokenBalance(
                    TEST_WALLET_PUBLIC_KEY,
                    tokenMint
                );
            }

            return res.status(200).json({
                success: true,
                data: {
                    walletAddress: TEST_WALLET_PUBLIC_KEY,
                    solBalance,
                    tokenBalance: typeof tokenBalance === 'number' ? {
                        mint: tokenMint,
                        amount: tokenBalance,
                        decimals: 0
                    } : tokenBalance ? {
                        mint: tokenMint,
                        amount: tokenBalance.amount,
                        decimals: tokenBalance.decimals
                    } : undefined
                },
                message: '钱包余额查询成功'
            });
        } catch (error) {
            console.error('钱包余额查询API错误:', error);
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            return res.status(500).json({
                success: false,
                message: `钱包余额查询失败: ${errorMessage}`
            });
        }
    }
} 