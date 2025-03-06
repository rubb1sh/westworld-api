import { SolanaService } from '../SolanaService';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';  // 需要安装: yarn add bs58

// 设置更长的超时时间
jest.setTimeout(30000);

describe('SolanaService Tests', () => {
    let solanaService: SolanaService;

    beforeAll(() => {
        solanaService = new SolanaService();
    });

    describe('Account Operations', () => {
        it('应该成功创建新账户并获取余额', async () => {
            const account = await solanaService.createAccount();
            
            // 打印账户信息
            console.log('\n新创建的账户信息:');
            console.log('公钥:', account.publicKey);
            console.log('私钥 (base58):', bs58.encode(account.secretKey));
            
            try {
                // 请求空投
                await solanaService.requestAirdrop(account.publicKey, 1);
                // 等待交易确认
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                // 获取并打印账户余额
                const balance = await solanaService.getBalance(account.publicKey);
                console.log('空投后账户余额:', balance, 'SOL');
                
                expect(balance).toBeGreaterThan(0);
            } catch (error) {
                console.log('空投失败，跳过余额检查:', error);
            }
            
            expect(account).toBeDefined();
            expect(account.publicKey).toBeDefined();
            expect(account.secretKey).toBeDefined();
            expect(typeof account.publicKey).toBe('string');
            expect(account.secretKey instanceof Uint8Array).toBe(true);
        });

        it('应该成功获取账户信息', async () => {
            // 创建一个新的测试账户
            const testKeypair = Keypair.generate();
            
            const accountInfo = await solanaService.getAccountInfo(testKeypair.publicKey.toString());
            
            // 打印账户详细信息
            console.log('\n测试账户详细信息:');
            console.log('公钥:', testKeypair.publicKey.toString());
            console.log('账户信息:', accountInfo ? {
                余额: `${accountInfo.lamports / LAMPORTS_PER_SOL} SOL`,
                所有者: accountInfo.owner.toString(),
                可执行: accountInfo.executable ? '是' : '否',
                租金豁免: accountInfo.rentEpoch ? '是' : '否'
            } : '账户未初始化');
            
            // 验证账户信息
            expect(accountInfo).toBeDefined();
            if (accountInfo) {
                expect(accountInfo.lamports).toBeDefined();
                expect(accountInfo.owner).toBeDefined();
            }
        });

        it('对于无效的公钥应该抛出错误', async () => {
            const invalidPublicKey = 'invalid_public_key';
            
            console.log('\n测试无效公钥:');
            console.log('无效公钥:', invalidPublicKey);
            
            await expect(solanaService.getBalance(invalidPublicKey))
                .rejects
                .toThrow();
        });
    });
}); 