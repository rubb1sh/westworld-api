import { Router } from 'express';

const router: Router = Router()

/**
 * Import your routes then
 * Add each route into the router
 * You can use the example below to start
 */

// ----- EXAMPLE >> -----

import users from './routes/users'
router.use(users)

// ----- << EXAMPLE -----

export default router