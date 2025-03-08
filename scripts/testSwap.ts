import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolanaService } from '../src/services/SolanaService';
import { SwapService } from '../src/services/SwapService';
import { JupiterService } from '../src/services/JupiterService';
import bs58 from 'bs58';

// 设置环境变量为主网
process.env.SOLANA_NETWORK = 'mainnet-beta';

// 主网上的代币地址
const TOKENS = {
    SOL: 'So11111111111111111111111111111111111111112',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',  // 主网 USDC
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',  // 主网 USDT
    BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'  // 主网 BONK
};

// 添加创建已知账户的 Keypair 的函数
function createKeypairFromPrivateKey(privateKeyStr: string): Keypair {
    const privateKeyBytes = bs58.decode(privateKeyStr);
    return Keypair.fromSecretKey(new Uint8Array(privateKeyBytes));
}

// 已知账户信息
const KNOWN_ACCOUNT = {
    publicKey: 'B5AnksFrGr548DMXHmyz2BmHYpKCnemkACH665qNnCoE',
    privateKey: 'Y99449Bsos2fwx26A5w4f1w2RHYCy9EC64uHX9r5PZ3JaTxNEy4YyMKpdxM8YeAXF5NxJvyVsACnjhYNFWBcW7v'
};

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        console.log('开始测试流程...');

        // 使用已知账户创建 Keypair
        console.log('\n1. 使用已知账户...');
        const existingKeypair = createKeypairFromPrivateKey(KNOWN_ACCOUNT.privateKey);
        console.log('账户公钥:', existingKeypair.publicKey.toString());
        
        // 验证公钥是否匹配
        if (existingKeypair.publicKey.toString() !== KNOWN_ACCOUNT.publicKey) {
            throw new Error('生成的公钥与预期不匹配');
        }
        console.log('公钥验证成功！');

        // 初始化服务
        const solanaService = new SolanaService();
        const swapService = new SwapService();
        const jupiterService = new JupiterService();

        // 检查余额
        const balance = await solanaService.getBalance(existingKeypair.publicKey.toString());
        console.log('当前账户余额:', balance, 'SOL');

        if (balance < 0.01) { // 主网上需要确保有足够的 SOL
            throw new Error('余额不足，请确保账户中有足够的 SOL');
        }

        // 获取交换报价
        console.log('\n2. 获取 SOL 到 USDC 的交换报价...');
        const swapAmount = 0.01; // 交换 0.01 SOL，主网上建议先用小额测试
        const priceSummary = await jupiterService.getPriceSummary(
            TOKENS.SOL,
            TOKENS.USDC,
            swapAmount * LAMPORTS_PER_SOL,
            1 // 1% 滑点
        );
        console.log('交换报价:\n', priceSummary);

        // 执行交换
        console.log('\n3. 执行代币交换...');
        const privateKeyStr = bs58.encode(existingKeypair.secretKey);
        const swapResult = await swapService.executeSwapWithPrivateKey(
            privateKeyStr,
            TOKENS.SOL,
            TOKENS.USDC,
            swapAmount,
            1
        );

        // 输出结果
        console.log('\n4. 交换结果:');
        console.log('交易签名:', swapResult.signature);
        console.log('输入金额:', swapResult.transactionDetails.inputAmount / LAMPORTS_PER_SOL, 'SOL');
        console.log('预期输出金额:', swapResult.transactionDetails.expectedOutputAmount, 'USDC');
        console.log('交易费用:', swapResult.transactionDetails.fee / LAMPORTS_PER_SOL, 'SOL');
        console.log('区块时间:', new Date(swapResult.transactionDetails.blockTime * 1000).toLocaleString());

        // 最终余额检查
        const finalBalance = await solanaService.getBalance(existingKeypair.publicKey.toString());
        console.log('\n5. 最终账户余额:', finalBalance, 'SOL');

    } catch (error) {
        console.error('测试过程中发生错误:', error);
        process.exit(1);
    }
}

// 运行测试
main().then(() => {
    console.log('\n测试完成！');
    process.exit(0);
}).catch(error => {
    console.error('测试失败:', error);
    process.exit(1);
}); 