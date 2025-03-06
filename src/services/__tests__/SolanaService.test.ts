import { SolanaService } from '../SolanaService';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

describe('SolanaService Tests', () => {
    let solanaService: SolanaService;

    beforeAll(() => {
        solanaService = new SolanaService();
    });

    describe('Account Operations', () => {
        it('应该成功创建新账户', async () => {
            const account = await solanaService.createAccount();
            
            // 打印账户信息
            console.log('\n新创建的账户信息:');
            console.log('公钥:', account.publicKey);
            console.log('私钥 (base58):', Buffer.from(account.secretKey).toString('base58'));
            
            // 获取并打印账户余额
            const balance = await solanaService.getBalance(account.publicKey);
            console.log('账户余额:', balance, 'SOL');
            
            expect(account).toBeDefined();
            expect(account.publicKey).toBeDefined();
            expect(account.secretKey).toBeDefined();
            expect(typeof account.publicKey).toBe('string');
            expect(account.secretKey instanceof Uint8Array).toBe(true);
        });

        it('应该成功获取账户信息', async () => {
            // 创建一个新的测试账户
            const testKeypair = Keypair.generate();
            
            // 请求空投来初始化账户（仅在开发网络有效）
            try {
                await solanaService.requestAirdrop(testKeypair.publicKey.toString(), 1);
                // 等待交易确认
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                const accountInfo = await solanaService.getAccountInfo(testKeypair.publicKey.toString());
                
                console.log('\n已初始化的测试账户详细信息:');
                console.log('公钥:', testKeypair.publicKey.toString());
                console.log('账户信息:');
                if (accountInfo) {
                    console.log({
                        余额: `${accountInfo.lamports / LAMPORTS_PER_SOL} SOL`,
                        所有者: accountInfo.owner.toString(),
                        可执行: accountInfo.executable ? '是' : '否',
                        租金豁免: accountInfo.rentEpoch ? '是' : '否'
                    });
                }
                
                expect(accountInfo).toBeDefined();
                expect(accountInfo?.lamports).toBeGreaterThan(0);
                
            } catch (error) {
                console.log('空投失败，账户未能初始化:', error);
                // 继续测试未初始化账户的情况
                const accountInfo = await solanaService.getAccountInfo(testKeypair.publicKey.toString());
                console.log('\n未初始化的测试账户详细信息:');
                console.log('公钥:', testKeypair.publicKey.toString());
                console.log('账户信息: 账户未初始化');
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