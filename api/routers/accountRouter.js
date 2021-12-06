import { Router } from 'express';
import { asyncMiddleware } from '../middleware';

export const accountRouter = Router();

accountRouter.post(
    '/register',
    asyncMiddleware((_, res) => {
        return res.json({
            data: {
                id: 1026
            },
            code: 'USER_REGISTERED',
            message: 'User successfully registered.'
        });
    })
);

accountRouter.put(
    '/forgotpassword',
    asyncMiddleware((_, res) => {
        return res.json({
            code: 'FORGOT_PASSWORD',
            message:
                'Instructions as to how to reset your password have been sent to you via email.'
        });
    })
);

accountRouter.put(
    '/resetpassword',
    asyncMiddleware((_, res) => {
        return res.json({
            data: {
                id: 1024
            },
            code: 'PASSWORD_RESET',
            message: 'Your password has been reset.'
        });
    })
);
