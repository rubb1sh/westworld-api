import fetch from 'cross-fetch';  // 需要先安装: npm install cross-fetch
import { createJupiterApiClient } from '@jup-ag/api';

const TOKEN_LIST_URL = 'https://token.jup.ag/strict';

interface FormattedPrice {
    inputToken: {
        symbol: string;
        amount: number;
        decimals: number;
        uiAmount: number;
    };
    outputToken: {
        symbol: string;
        amount: number;
        decimals: number;
        uiAmount: number;
    };
    priceImpact: number;
    route: {
        steps: Array<{
            protocol: string;
            fromToken: string;
            toToken: string;
            fromAmount: number;
            toAmount: number;
        }>;
    };
    fees: {
        totalFees: number;
    };
}

export class JupiterService {
    private jupiterQuoteApi;
    private tokenList: any[] = [];

    constructor() {
        // 创建 Jupiter API 客户端
        this.jupiterQuoteApi = createJupiterApiClient();
    }

    // 初始化代币列表
    async initialize() {
        try {
            // 获取代币列表
            const response = await fetch(TOKEN_LIST_URL);
            this.tokenList = await response.json();
        } catch (error) {
            console.error('初始化 Jupiter 服务失败:', error);
            throw error;
        }
    }

    // 获取代币价格报价
    async getPrice(
        inputMint: string,
        outputMint: string,
        amount: number,
        slippage: number = 1 // 默认滑点 1%
    ) {
        try {
            if (this.tokenList.length === 0) {
                await this.initialize();
            }

            // 获取报价
            const quoteResponse = await this.jupiterQuoteApi.quoteGet({
                inputMint,
                outputMint,
                amount: amount.toString(), // 直接使用传入的数量（应该已经是最小单位）
                slippageBps: slippage * 100, // 转换为基点 (1% = 100 基点)
                onlyDirectRoutes: false,
            });

            if (!quoteResponse) {
                throw new Error('没有找到可用的交易路由');
            }

            return {
                inputAmount: quoteResponse.inAmount,
                outputAmount: quoteResponse.outAmount,
                priceImpact: quoteResponse.priceImpactPct,
                route: this.formatRoute(quoteResponse),
                fees: {
                    platformFee: quoteResponse.platformFee,
                    totalFees: quoteResponse.otherAmountThreshold
                }
            };
        } catch (error) {
            console.error('获取价格失败:', error);
            throw error;
        }
    }

    // 获取所有支持的代币
    async getSupportedTokens() {
        try {
            if (this.tokenList.length === 0) {
                await this.initialize();
            }

            return this.tokenList.map(token => ({
                symbol: token.symbol,
                name: token.name,
                mint: token.address,
                decimals: token.decimals,
                logoURI: token.logoURI
            }));
        } catch (error) {
            console.error('获取支持的代币列表失败:', error);
            throw error;
        }
    }

    // 查找代币信息
    async getTokenInfo(mintAddress: string) {
        try {
            if (this.tokenList.length === 0) {
                await this.initialize();
            }

            const tokenInfo = this.tokenList.find(
                token => token.address === mintAddress
            );

            if (!tokenInfo) {
                throw new Error('找不到该代币信息');
            }

            return {
                symbol: tokenInfo.symbol,
                name: tokenInfo.name,
                mint: tokenInfo.address,
                decimals: tokenInfo.decimals,
                logoURI: tokenInfo.logoURI
            };
        } catch (error) {
            console.error('获取代币信息失败:', error);
            throw error;
        }
    }

    // 格式化路由信息
    private formatRoute(quote: any) {
        return {
            marketInfos: quote.routePlan.map((routeStep: any) => ({
                label: routeStep.swapInfo.label,
                inputMint: routeStep.swapInfo.inputMint,
                outputMint: routeStep.swapInfo.outputMint,
                inAmount: routeStep.swapInfo.inAmount,
                outAmount: routeStep.swapInfo.outAmount,
                fee: routeStep.swapInfo.fee
            }))
        };
    }

    // 获取格式化的价格数据
    async getFormattedPrice(
        inputMint: string,
        outputMint: string,
        amount: number,
        slippage: number = 1
    ): Promise<FormattedPrice> {
        const price = await this.getPrice(inputMint, outputMint, amount, slippage);
        const inputToken = await this.getTokenInfo(inputMint);
        const outputToken = await this.getTokenInfo(outputMint);

        return {
            inputToken: {
                symbol: inputToken.symbol,
                amount: Number(price.inputAmount),
                decimals: inputToken.decimals,
                uiAmount: Number(price.inputAmount) / Math.pow(10, inputToken.decimals)
            },
            outputToken: {
                symbol: outputToken.symbol,
                amount: Number(price.outputAmount),
                decimals: outputToken.decimals,
                uiAmount: Number(price.outputAmount) / Math.pow(10, outputToken.decimals)
            },
            priceImpact: Number(price.priceImpact),
            route: {
                steps: price.route.marketInfos.map(async (step: any) => {
                    const fromToken = await this.getTokenInfo(step.inputMint);
                    const toToken = await this.getTokenInfo(step.outputMint);
                    return {
                        protocol: step.label,
                        fromToken: fromToken.symbol,
                        toToken: toToken.symbol,
                        fromAmount: Number(step.inAmount) / Math.pow(10, fromToken.decimals),
                        toAmount: Number(step.outAmount) / Math.pow(10, toToken.decimals)
                    };
                })
            },
            fees: {
                totalFees: Number(price.fees.totalFees) / Math.pow(10, outputToken.decimals)
            }
        };
    }

    // 获取人类可读的价格摘要
    async getPriceSummary(
        inputMint: string,
        outputMint: string,
        amount: number,
        slippage: number = 1
    ): Promise<string> {
        const formattedPrice = await this.getFormattedPrice(inputMint, outputMint, amount, slippage);
        
        const summary = [
            `交易概要:`,
            `输入: ${formattedPrice.inputToken.uiAmount} ${formattedPrice.inputToken.symbol}`,
            `输出: ${formattedPrice.outputToken.uiAmount} ${formattedPrice.outputToken.symbol}`,
            `价格影响: ${formattedPrice.priceImpact}%`,
            `费用: ${formattedPrice.fees.totalFees} ${formattedPrice.outputToken.symbol}`,
            `\n路由信息:`,
            ...(await Promise.all(formattedPrice.route.steps)).map(step => 
                `${step.protocol}: ${step.fromAmount} ${step.fromToken} → ${step.toAmount} ${step.toToken}`
            )
        ];

        return summary.join('\n');
    }
} 