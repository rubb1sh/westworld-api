import { Router, Request, Response } from 'express'

const router = Router()

/**
 * In the example below, we're binding a RequestHandler to a specific URI (/api/users in this case)
 * The RequestHandler returns a list of users
 */

// ----- EXAMPLE >> -----

router.get('/api/users', function getUsers(request: Request, response: Response) {
    response.status(200)
    response.json([
        {
            id: 1,
            email: 'toto@gmail.com'
        },
        {
            id: 2,
            email: 'tata@gmail.com'
        },
    ])
})

// ----- << EXAMPLE -----

export default router