import { Router } from 'express';

export const manageRouter = Router();

manageRouter.get('/', (_, res) => {
    return res.json({
        data: {
            id: 1024,
            emailAddress: 'cpoulter@hotmail.co.uk',
            firstName: 'Chris',
            lastName: 'Poulter',
            dateOfBirth: '2021-01-01T00:00:00Z'
        }
    });
});

manageRouter.put('/', (_, res) => {
    return res.json({
        data: {
            id: 1024
        },
        code: 'PROFILE_UPDATED',
        message: 'Your profile has been updated.'
    });
});

manageRouter.put('/changepassword', (_, res) => {
    return res.json({
        data: {
            id: 1024
        },
        code: 'PASSWORD_CHANGED',
        message: 'Your password has been changed.'
    });
});

manageRouter.delete('/', (_, res) => {
    return res.json({
        data: {
            id: 1024
        },
        code: 'ACCOUNT_DELETED',
        message: 'Your account has been deleted.'
    });
});
