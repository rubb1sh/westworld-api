import { Router } from 'express'

// Import the controllers
import users from './controllers/users'

// Instantiate the main router
const router: Router = Router()

// Plug the controllers
router.use(users)

export default router
