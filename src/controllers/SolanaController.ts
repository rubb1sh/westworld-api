import { Request, Response } from 'express';
import { SolanaService } from '../services/SolanaService';

export class SolanaController {
    private solanaService: SolanaService;

    constructor() {
        this.solanaService = new SolanaService();
    }

    async getBalance(req: Request, res: Response) {
        try {
            const { publicKey } = req.params;
            const balance = await this.solanaService.getBalance(publicKey);
            res.json({ balance });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createAccount(req: Request, res: Response) {
        try {
            const account = await this.solanaService.createAccount();
            res.json(account);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async requestAirdrop(req: Request, res: Response) {
        try {
            const { publicKey, amount } = req.body;
            const signature = await this.solanaService.requestAirdrop(publicKey, amount);
            res.json({ signature });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
} 