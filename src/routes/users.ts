import { Router } from 'express';
import { User } from 'models/User';

const router = Router();

/**
 * In the example below, we're binding a RequestHandler to a specific URI (/api/users in this case)
 * The RequestHandler returns a list of users
 */
router.get('/v1/users', function getUsers(request, response) {
    const users: User[] = [
        {
            id: 1,
            email: 'toto@gmail.com',
        },
        {
            id: 2,
            email: 'tata@gmail.com',
        },
    ];
    const status = 200;

    return response.status(status).json({ data: users });
});

export default router;
