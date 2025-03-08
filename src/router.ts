import { Router } from 'express';
import solanaRoutes from './routes/solana.routes';
import difyRoutes from './routes/dify';

// Import the routes
import users from './routes/users';

// Instantiate the main router
const router: Router = Router();

// Plug the routes
router.use(users);
router.use('/api/solana', solanaRoutes);
router.use('/api/dify', difyRoutes);

export default router;
