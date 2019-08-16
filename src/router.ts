import { Router } from 'express';

// Import the routes
import users from './routes/users';

// Instantiate the main router
const router: Router = Router();

// Plug the routes
router.use(users);

export default router;
