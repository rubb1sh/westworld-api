import { 
    Connection, 
    PublicKey, 
    clusterApiUrl, 
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    Keypair,
    Cluster
} from '@solana/web3.js';

export class SolanaService {
    private _connection: Connection;

    constructor() {
        const network = (process.env.SOLANA_NETWORK || 'devnet') as Cluster;
        const endpoint = process.env.SOLANA_RPC_ENDPOINT || clusterApiUrl(network);
        this._connection = new Connection(endpoint);
    }

    // 获取账户余额
    async getBalance(publicKeyStr: string): Promise<number> {
        try {
            const publicKey = new PublicKey(publicKeyStr);
            const balance = await this._connection.getBalance(publicKey);
            return balance / LAMPORTS_PER_SOL; // 转换为 SOL
        } catch (error) {
            console.error('获取余额失败:', error);
            throw error;
        }
    }

    // 获取账户信息
    async getAccountInfo(publicKeyStr: string) {
        try {
            const publicKey = new PublicKey(publicKeyStr);
            const accountInfo = await this._connection.getAccountInfo(publicKey);
            return accountInfo;
        } catch (error) {
            console.error('获取账户信息失败:', error);
            throw error;
        }
    }

    // 创建新账户
    async createAccount(): Promise<{ publicKey: string; secretKey: Uint8Array }> {
        try {
            const newAccount = Keypair.generate();
            return {
                publicKey: newAccount.publicKey.toString(),
                secretKey: newAccount.secretKey
            };
        } catch (error) {
            console.error('创建账户失败:', error);
            throw error;
        }
    }

    // 转账 SOL
    async transfer(
        fromKeypair: Keypair,
        toPublicKeyStr: string,
        amount: number
    ) {
        try {
            const toPublicKey = new PublicKey(toPublicKeyStr);
            
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromKeypair.publicKey,
                    toPubkey: toPublicKey,
                    lamports: amount * LAMPORTS_PER_SOL
                })
            );

            const signature = await sendAndConfirmTransaction(
                this._connection,
                transaction,
                [fromKeypair]
            );

            return signature;
        } catch (error) {
            console.error('转账失败:', error);
            throw error;
        }
    }

    // 请求空投（仅在测试网络有效）
    async requestAirdrop(publicKeyStr: string, amount: number) {
        try {
            const publicKey = new PublicKey(publicKeyStr);
            const signature = await this._connection.requestAirdrop(
                publicKey,
                amount * LAMPORTS_PER_SOL
            );
            await this._connection.confirmTransaction({
                signature,
                blockhash: (await this._connection.getLatestBlockhash()).blockhash,
                lastValidBlockHeight: (await this._connection.getLatestBlockhash()).lastValidBlockHeight,
            });
            return signature;
        } catch (error) {
            console.error('请求空投失败:', error);
            throw error;
        }
    }

    // 添加 getter 方法来访问 connection
    public get connection(): Connection {
        return this._connection;
    }
} 