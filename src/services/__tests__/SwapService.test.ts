import { SwapService } from '../SwapService';
import { JupiterService } from '../JupiterService';
import { SolanaService } from '../SolanaService';
import { Keypair, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as dotenv from 'dotenv';
import bs58 from 'bs58';

dotenv.config();

// // Mock 依赖服务
// jest.mock('../JupiterService');
// jest.mock('../SolanaService');

// describe('SwapService', () => {
//     let swapService: SwapService;
//     let mockJupiterService: jest.Mocked<JupiterService>;
//     let mockSolanaService: jest.Mocked<SolanaService>;
//     let testKeypair: Keypair;

//     beforeEach(() => {
//         // 重置所有 mock
//         jest.clearAllMocks();

//         // 创建测试用的 Keypair
//         testKeypair = Keypair.generate();

//         // 设置 mock 服务
//         mockJupiterService = new JupiterService() as jest.Mocked<JupiterService>;
//         mockSolanaService = new SolanaService() as jest.Mocked<SolanaService>;

//         // 初始化 SwapService
//         swapService = new SwapService();
//         (swapService as any).jupiterService = mockJupiterService;
//         (swapService as any).solanaService = mockSolanaService;
//     });

//     describe('executeSwap', () => {
//         const mockInputMint = 'inputMintAddress';
//         const mockOutputMint = 'outputMintAddress';
//         const mockAmount = 1000000;
//         const mockSlippage = 1;

//         it('应该成功执行代币交换', async () => {
//             // 设置 mock 返回值
//             mockSolanaService.getBalance.mockResolvedValue(2); // 2 SOL 余额

//             const mockQuoteData = {
//                 swapTransaction: Buffer.from('mockTransactionData').toString('base64')
//             };
//             mockJupiterService.getFormattedPrice.mockResolvedValue(mockQuoteData);

//             const mockSummary = {
//                 inAmount: mockAmount,
//                 outAmount: mockAmount * 0.98,
//                 priceImpact: 0.02,
//                 fee: 0.001
//             };
//             mockJupiterService.getPriceSummary.mockResolvedValue(mockSummary);

//             // Mock connection 和交易相关方法
//             const mockSignature = 'mockTransactionSignature';
//             const mockBlockTime = 1234567890;
//             const mockSlot = 123456;
//             const mockFee = 5000;

//             mockSolanaService.connection = {
//                 getLatestBlockhash: jest.fn().mockResolvedValue({
//                     blockhash: 'mockBlockhash',
//                     lastValidBlockHeight: 123456
//                 }),
//                 getTransaction: jest.fn().mockResolvedValue({
//                     blockTime: mockBlockTime,
//                     slot: mockSlot,
//                     meta: { fee: mockFee }
//                 }),
//                 sendAndConfirmTransaction: jest.fn().mockResolvedValue(mockSignature)
//             } as any;

//             // 执行交换
//             const result = await swapService.executeSwap(
//                 testKeypair,
//                 mockInputMint,
//                 mockOutputMint,
//                 mockAmount,
//                 mockSlippage
//             );

//             // 验证结果
//             expect(result.success).toBe(true);
//             expect(result.signature).toBe(mockSignature);
//             expect(result.transactionDetails).toMatchObject({
//                 fromAddress: testKeypair.publicKey.toString(),
//                 inputMint: mockInputMint,
//                 outputMint: mockOutputMint,
//                 inputAmount: mockAmount,
//                 slippage: mockSlippage,
//                 blockTime: mockBlockTime,
//                 slot: mockSlot,
//                 fee: mockFee
//             });

//             // 验证方法调用
//             expect(mockSolanaService.getBalance).toHaveBeenCalledWith(
//                 testKeypair.publicKey.toString()
//             );
//             expect(mockJupiterService.getFormattedPrice).toHaveBeenCalledWith(
//                 mockInputMint,
//                 mockOutputMint,
//                 mockAmount,
//                 mockSlippage
//             );
//             expect(mockJupiterService.getPriceSummary).toHaveBeenCalledWith(
//                 mockInputMint,
//                 mockOutputMint,
//                 mockAmount,
//                 mockSlippage
//             );
//         });

//         it('当账户余额不足时应该抛出错误', async () => {
//             // Mock 余额为 0
//             mockSolanaService.getBalance.mockResolvedValue(0);

//             // 验证错误抛出
//             await expect(
//                 swapService.executeSwap(
//                     testKeypair,
//                     mockInputMint,
//                     mockOutputMint,
//                     mockAmount,
//                     mockSlippage
//                 )
//             ).rejects.toThrow('账户余额不足');
//         });

//         it('当获取报价失败时应该抛出错误', async () => {
//             // Mock 正常余额
//             mockSolanaService.getBalance.mockResolvedValue(2);

//             // Mock 报价失败
//             mockJupiterService.getFormattedPrice.mockRejectedValue(
//                 new Error('获取报价失败')
//             );

//             // 验证错误抛出
//             await expect(
//                 swapService.executeSwap(
//                     testKeypair,
//                     mockInputMint,
//                     mockOutputMint,
//                     mockAmount,
//                     mockSlippage
//                 )
//             ).rejects.toThrow('获取报价失败');
//         });
//     });

//     describe('getTokenBalance', () => {
//         it('应该抛出未实现错误', async () => {
//             await expect(
//                 swapService.getTokenBalance('mockAddress', 'mockMint')
//             ).rejects.toThrow('该功能尚未实现');
//         });
//     });
// });

// describe('SwapService Integration Tests', () => {
//     let swapService: SwapService;
    
//     // 测试账户私钥（请在环境变量中设置）
//     const TEST_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY;
    
//     // 常用代币地址
//     const SOL_MINT = 'So11111111111111111111111111111111111111112';
//     const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

//     beforeAll(() => {
//         // 确保环境变量已设置
//         if (!TEST_PRIVATE_KEY) {
//             throw new Error('请设置 TEST_WALLET_PRIVATE_KEY 环境变量');
//         }
//         if (!process.env.SOLANA_NETWORK) {
//             console.warn('未设置 SOLANA_NETWORK，将使用默认网络 devnet');
//         }

//         swapService = new SwapService();
//     });

//     describe('executeSwapWithPrivateKey', () => {
//         it('应该成功执行 SOL 到 USDC 的交换', async () => {
//             const amount = 0.1; // 交换 0.1 SOL
//             const slippage = 1; // 1% 滑点

//             const result = await swapService.executeSwapWithPrivateKey(
//                 TEST_PRIVATE_KEY,
//                 SOL_MINT,
//                 USDC_MINT,
//                 amount,
//                 slippage
//             );

//             // 验证交易结果
//             expect(result.success).toBe(true);
//             expect(result.signature).toBeTruthy();
//             expect(result.transactionDetails).toMatchObject({
//                 inputMint: SOL_MINT,
//                 outputMint: USDC_MINT,
//                 inputAmount: amount * LAMPORTS_PER_SOL,
//                 slippage: slippage
//             });

//             // 打印详细信息供手动验证
//             console.log('交易详情:', {
//                 signature: result.signature,
//                 inputAmount: result.transactionDetails.inputAmount / LAMPORTS_PER_SOL + ' SOL',
//                 expectedOutputAmount: result.transactionDetails.expectedOutputAmount + ' USDC',
//                 actualFee: (result.transactionDetails.fee ?? 0) / LAMPORTS_PER_SOL + ' SOL',
//                 blockTime: result.transactionDetails.blockTime ? new Date(result.transactionDetails.blockTime * 1000).toLocaleString() : 'N/A'
//             });
//         }, 30000); // 增加超时时间到 30 秒

//         it('应该能查询账户余额', async () => {
//             const balance = await swapService['solanaService'].getBalance(
//                 // 从私钥创建 Keypair 并获取公钥
//                 Keypair.fromSecretKey(bs58.decode(TEST_PRIVATE_KEY!))
//                     .publicKey.toString()
//             );

//             expect(balance).toBeGreaterThan(0);
//             console.log('当前账户余额:', balance, 'SOL');
//         });
//     });
// });

describe('SwapService Token Balance Tests', () => {
    let swapService: SwapService;
    
    // 从环境变量获取钱包信息
    const TEST_PUBLIC_KEY = process.env.TEST_WALLET_PUBLIC_KEY!;
    const TEST_PRIVATE_KEY = process.env.TEST_WALLET_PRIVATE_KEY;

    // USDC 代币的 Mint 地址（Solana 主网）
    const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

    beforeAll(() => {
        // 初始化服务
        swapService = new SwapService();
        
        // 输出警告，提醒用户设置环境变量
        if (!process.env.TEST_WALLET_PUBLIC_KEY || !process.env.TEST_WALLET_PRIVATE_KEY) {
            console.warn('警告: 未在环境变量中设置 TEST_WALLET_PUBLIC_KEY 或 TEST_WALLET_PRIVATE_KEY，使用了默认值。建议在生产环境中使用环境变量存储敏感信息。');
        }
    });

    describe('getTokenBalance', () => {
        it('应该能够查询USDC余额', async () => {
            try {
                const balance = await swapService.getTokenBalance(
                    TEST_PUBLIC_KEY,
                    USDC_MINT
                );

                // 处理可能为0的情况
                if (balance === 0) {
                    console.log('USDC 余额为 0');
                    expect(balance).toBe(0);
                } else {
                    console.log('USDC 余额信息:', {
                        rawAmount: balance.amount,
                        decimals: balance.decimals,
                        uiAmount: balance.uiAmount
                    });

                    // 验证返回的余额格式是否正确
                    expect(balance).toHaveProperty('amount');
                    expect(balance).toHaveProperty('decimals');
                    expect(balance).toHaveProperty('uiAmount');
                    
                    // USDC 应该有 6 位小数
                    expect(balance.decimals).toBe(6);
                }
            } catch (error) {
                console.error('测试失败:', error);
                throw error;
            }
        }, 30000); // 增加超时时间到 30 秒

        it('应该能够处理无效的钱包地址', async () => {
            const invalidAddress = 'invalid-address';
            
            await expect(
                swapService.getTokenBalance(invalidAddress, USDC_MINT)
            ).rejects.toThrow();
        });

        it('应该能够处理不存在的代币账户', async () => {
            // 使用一个随机生成的有效 Solana 地址
            const randomKeypair = Keypair.generate();
            
            const balance = await swapService.getTokenBalance(
                randomKeypair.publicKey.toString(),
                USDC_MINT
            );

            expect(balance).toBe(0);
        });
    });
}); 