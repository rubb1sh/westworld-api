import { Keypair, Transaction, Connection, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js';
import { JupiterService } from './JupiterService';
import { SolanaService } from './SolanaService';
import bs58 from 'bs58';

export class SwapService {
    private jupiterService: JupiterService;
    private solanaService: SolanaService;

    constructor() {
        this.jupiterService = new JupiterService();
        this.solanaService = new SolanaService();
    }

    // 执行代币交换
    async executeSwap(
        fromKeypair: Keypair,
        inputMint: string,
        outputMint: string,
        amount: number,
        slippage: number = 1
    ) {
        try {
            // 1. 检查账户余额
            const balance = await this.solanaService.getBalance(fromKeypair.publicKey.toString());
            if (balance <= 0) {
                throw new Error('账户余额不足');
            }

            // 2. 获取交换报价
            const quoteData = await this.jupiterService.getFormattedPrice(
                inputMint,
                outputMint,
                amount,
                slippage
            );

            // 3. 获取交易概要（用于日志记录）
            const summary = await this.jupiterService.getPriceSummary(
                inputMint,
                outputMint,
                amount,
                slippage
            );
            console.log('交易概要:', summary);

            // 4. 构建并执行交换交易
            // 注意：这里需要使用 Jupiter SDK 的 exchange 方法
            // 由于 Jupiter API 的限制，这里只是示例代码
            // 实际实现需要依赖 Jupiter SDK 的完整功能
            const exchangeResult = await this.performExchange(
                fromKeypair,
                quoteData
            );

            return {
                success: true,
                signature: exchangeResult.signature,
                summary: summary,
                transactionDetails: {
                    fromAddress: fromKeypair.publicKey.toString(),
                    inputMint,
                    outputMint,
                    inputAmount: amount,
                    expectedOutputAmount: summary.toString(), // 修复 outAmount 不存在的问题,使用 toString()
                    slippage,
                    timestamp: new Date().toISOString(),
                    blockTime: exchangeResult.blockTime,
                    slot: exchangeResult.slot,
                    fee: exchangeResult.fee
                }
            };

        } catch (error) {
            console.error('代币交换失败:', error);
            throw error;
        }
    }

    // 获取用户代币余额
    async getTokenBalance(walletAddress: string, tokenMint: string) {
        try {
            // 这里需要实现代币余额查询逻辑
            // 需要使用 SPL Token 程序来查询代币余额
            // 这是一个待实现的功能
            throw new Error('该功能尚未实现');
        } catch (error) {
            console.error('获取代币余额失败:', error);
            throw error;
        }
    }

    // 执行实际的交换操作（示例实现）
    private async performExchange(fromKeypair: Keypair, quoteData: any) {
        try {
            // 1. 确保 quoteData 包含必要的信息
            if (!quoteData || !quoteData.swapTransaction) {
                throw new Error('无效的交换数据');
            }

            // 2. 从 quoteData 中解析交易数据
            const { swapTransaction } = quoteData;

            // 3. 反序列化交易
            const transaction = Transaction.from(Buffer.from(swapTransaction, 'base64'));

            // 4. 设置最新的 blockhash
            const latestBlockhash = await this.solanaService.connection.getLatestBlockhash();
            transaction.recentBlockhash = latestBlockhash.blockhash;
            transaction.feePayer = fromKeypair.publicKey;

            // 5. 签名交易
            transaction.sign(fromKeypair);

            // 6. 发送并确认交易
            const signature = await sendAndConfirmTransaction(
                this.solanaService.connection,
                transaction,
                [fromKeypair],
                {
                    commitment: 'confirmed',
                    maxRetries: 3
                }
            );

            // 7. 获取交易详情
            const transactionDetails = await this.solanaService.connection.getTransaction(signature, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0
            });

            return {
                success: true,
                signature: signature,
                blockTime: transactionDetails?.blockTime,
                slot: transactionDetails?.slot,
                fee: transactionDetails?.meta?.fee
            };
        } catch (error) {
            console.error('执行交换操作失败:', error);
            // 修复错误处理
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            throw new Error(`交换执行失败: ${errorMessage}`);
        }
    }

    /**
     * 从私钥字符串创建 Keypair 并执行 swap
     * @param privateKeyStr Base58 编码的私钥字符串
     * @param inputMint 输入代币的铸币地址
     * @param outputMint 输出代币的铸币地址
     * @param amount 交换数量
     * @param slippage 滑点百分比
     */
    async executeSwapWithPrivateKey(
        privateKeyStr: string,
        inputMint: string,
        outputMint: string,
        amount: number,
        slippage: number = 1
    ) {
        try {
            // 从私钥字符串创建 Keypair
            const privateKeyUint8Array = Uint8Array.from(bs58.decode(privateKeyStr));
            const keypair = Keypair.fromSecretKey(privateKeyUint8Array);

            // 执行 swap
            return await this.executeSwap(
                keypair,
                inputMint,
                outputMint,
                amount,
                slippage
            );
        } catch (error) {
            console.error('使用私钥执行交换失败:', error);
            // 修复错误处理
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            throw new Error(`交换失败: ${errorMessage}`);
        }
    }
} 