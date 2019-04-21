import { Router } from 'express'

// Routes
import users from './controllers/users'

// Router
const router: Router = Router()
router.use(users)

export default router
