import { Router } from 'express'
import { User } from 'models/User'

const router = Router()

/**
 * In the example below, we're binding a RequestHandler to a specific URI (/api/users in this case)
 * The RequestHandler returns a list of users
 */
router.get('/api/users', function getUsers(request, response) {
    console.log(request.query)

    const json: User[] = [
        {
            id: 1,
            email: 'toto@gmail.com',
        },
        {
            id: 2,
            email: 'tata@gmail.com',
        },
    ]
    const status = 200

    return response.status(status).json(json)
})

export default router
