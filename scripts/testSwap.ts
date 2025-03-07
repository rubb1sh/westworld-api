import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolanaService } from '../src/services/SolanaService';
import { SwapService } from '../src/services/SwapService';
import { JupiterService } from '../src/services/JupiterService';
import bs58 from 'bs58';

// 设置环境变量
process.env.SOLANA_NETWORK = 'devnet';

// Devnet 上的代币地址
const TOKENS = {
    SOL: 'So11111111111111111111111111111111111111112',
    USDC: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' // Devnet USDC
};

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        console.log('开始测试流程...');

        // 初始化服务
        const solanaService = new SolanaService();
        const swapService = new SwapService();
        const jupiterService = new JupiterService();

        // 1. 生成新账户
        console.log('\n1. 生成新的 Solana 账户...');
        const newAccount = await solanaService.createAccount();
        const keypair = Keypair.fromSecretKey(new Uint8Array(Object.values(newAccount.secretKey)));
        console.log('账户公钥:', newAccount.publicKey);
        console.log('账户私钥:', bs58.encode(keypair.secretKey)); // 保存这个私钥以便后续使用

        // 2. 请求空投
        console.log('\n2. 请求 SOL 空投...');
        const airdropAmount = 2; // 请求 2 SOL
        await solanaService.requestAirdrop(newAccount.publicKey, airdropAmount);
        console.log(`已请求 ${airdropAmount} SOL 的空投`);

        // 等待空投确认
        console.log('等待空投确认...');
        await sleep(5000);

        // 3. 检查余额
        const balance = await solanaService.getBalance(newAccount.publicKey);
        console.log('当前账户余额:', balance, 'SOL');

        if (balance < 1) {
            throw new Error('余额不足，空投可能未成功');
        }

        // 4. 获取交换报价
        console.log('\n3. 获取 SOL 到 USDC 的交换报价...');
        const swapAmount = 0.1; // 交换 0.1 SOL
        const priceSummary = await jupiterService.getPriceSummary(
            TOKENS.SOL,
            TOKENS.USDC,
            swapAmount * LAMPORTS_PER_SOL,
            1 // 1% 滑点
        );
        console.log('交换报价:\n', priceSummary);

        // 5. 执行交换
        console.log('\n4. 执行代币交换...');
        const privateKeyStr = bs58.encode(keypair.secretKey);
        const swapResult = await swapService.executeSwapWithPrivateKey(
            privateKeyStr,
            TOKENS.SOL,
            TOKENS.USDC,
            swapAmount,
            1
        );

        // 6. 输出结果
        console.log('\n5. 交换结果:');
        console.log('交易签名:', swapResult.signature);
        console.log('输入金额:', swapResult.transactionDetails.inputAmount / LAMPORTS_PER_SOL, 'SOL');
        console.log('预期输出金额:', swapResult.transactionDetails.expectedOutputAmount, 'USDC');
        console.log('交易费用:', swapResult.transactionDetails.fee! / LAMPORTS_PER_SOL, 'SOL');
        console.log('区块时间:', new Date(swapResult.transactionDetails.blockTime! * 1000).toLocaleString());

        // 7. 最终余额检查
        const finalBalance = await solanaService.getBalance(newAccount.publicKey);
        console.log('\n6. 最终账户余额:', finalBalance, 'SOL');

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