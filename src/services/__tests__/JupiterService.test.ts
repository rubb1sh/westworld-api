import { JupiterService } from '../JupiterService';

// 增加测试超时时间到 30 秒
jest.setTimeout(30000);

describe('JupiterService Integration Tests', () => {
    let jupiterService: JupiterService;
    
    // USDC 和 SOL 的 mint 地址
    const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
    const SOL_MINT = 'So11111111111111111111111111111111111111112';

    beforeAll(async () => {
        jupiterService = new JupiterService();
        await jupiterService.initialize();
    });

    describe('Token Operations', () => {
        it('应该成功获取支持的代币列表', async () => {
            const tokens = await jupiterService.getSupportedTokens();
            
            expect(Array.isArray(tokens)).toBe(true);
            expect(tokens.length).toBeGreaterThan(0);
            
            const usdc = tokens.find(token => token.mint === USDC_MINT);
            expect(usdc).toBeDefined();
            expect(usdc?.symbol).toBe('USDC');
        });

        it('应该成功获取 USDC 代币信息', async () => {
            const tokenInfo = await jupiterService.getTokenInfo(USDC_MINT);
            
            expect(tokenInfo).toBeDefined();
            expect(tokenInfo.symbol).toBe('USDC');
            expect(tokenInfo.decimals).toBe(6);
        });

        it('应该成功获取 SOL 代币信息', async () => {
            const tokenInfo = await jupiterService.getTokenInfo(SOL_MINT);
            
            expect(tokenInfo).toBeDefined();
            expect(tokenInfo.symbol).toBe('SOL');
            expect(tokenInfo.decimals).toBe(9);
        });

        it('对于无效的 mint 地址应该抛出错误', async () => {
            const invalidMint = 'invalid_mint_address';
            await expect(jupiterService.getTokenInfo(invalidMint))
                .rejects
                .toThrow('找不到该代币信息');
        });
    });

    describe('Price Quotations', () => {
        it('应该成功获取 USDC 到 SOL 的价格报价', async () => {
            const amount = 1000000; // 1 USDC (6位小数)
            
            const price = await jupiterService.getPrice(
                USDC_MINT,
                SOL_MINT,
                amount
            );
            
            expect(price).toBeDefined();
            expect(price.inputAmount).toBeDefined();
            expect(price.outputAmount).toBeDefined();
            expect(price.priceImpact).toBeDefined();
            expect(price.route).toBeDefined();
            expect(price.route.marketInfos.length).toBeGreaterThan(0);
        });

        it('应该成功处理不同的滑点设置', async () => {
            const amount = 1000000; // 1 USDC
            const slippage = 0.5; // 0.5% 滑点
            
            const price = await jupiterService.getPrice(
                USDC_MINT,
                SOL_MINT,
                amount,
                slippage
            );
            
            expect(price).toBeDefined();
            expect(price.inputAmount).toBeDefined();
            expect(price.outputAmount).toBeDefined();
        });
    });

    describe('Error Handling', () => {
        it('应该处理无效的代币对', async () => {
            const invalidMint = 'invalid_mint_address';
            const amount = 1000000;
            
            await expect(jupiterService.getPrice(
                invalidMint,
                SOL_MINT,
                amount
            )).rejects.toThrow();
        });

        it('应该处理无效的金额', async () => {
            const amount = -1;
            
            await expect(jupiterService.getPrice(
                USDC_MINT,
                SOL_MINT,
                amount
            )).rejects.toThrow();
        });
    });
}); 