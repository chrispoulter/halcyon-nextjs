import { Router } from 'express';
import { asyncMiddleware } from '../middleware';

export const manageRouter = Router();

manageRouter.get('/', asyncMiddleware((_, res) => {
    return res.json({
        data: {
            id: 1024,
            emailAddress: 'cpoulter@hotmail.co.uk',
            firstName: 'Chris',
            lastName: 'Poulter',
            dateOfBirth: '2021-01-01T00:00:00Z'
        }
    });
}));

manageRouter.put('/', asyncMiddleware((_, res) => {
    return res.json({
        data: {
            id: 1024
        },
        code: 'PROFILE_UPDATED',
        message: 'Your profile has been updated.'
    });
}));

manageRouter.put('/changepassword', asyncMiddleware((_, res) => {
    return res.json({
        data: {
            id: 1024
        },
        code: 'PASSWORD_CHANGED',
        message: 'Your password has been changed.'
    });
}));

manageRouter.delete('/', asyncMiddleware((_, res) => {
    return res.json({
        data: {
            id: 1024
        },
        code: 'ACCOUNT_DELETED',
        message: 'Your account has been deleted.'
    });
}));
