import { Router } from 'express';

export const router = Router();

router.post('/register', (_, res) => {
    return res.json({
        data: {
            id: 1026
        },
        code: 'USER_REGISTERED',
        message: 'User successfully registered.'
    });
});

router.put('/forgotpassword', (_, res) => {
    return res.json({
        code: 'FORGOT_PASSWORD',
        message:
            'Instructions as to how to reset your password have been sent to you via email.'
    });
});

router.put('/resetpassword', (_, res) => {
    return res.json({
        data: {
            id: 1024
        },
        code: 'PASSWORD_RESET',
        message: 'Your password has been reset.'
    });
});
