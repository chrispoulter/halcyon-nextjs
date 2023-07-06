import * as Yup from 'yup';

export const createTokenSchema = Yup.object().shape({
    emailAddress: Yup.string().label('Email Address').email().required(),
    password: Yup.string().label('Password').required()
});

export type CreateTokenRequest = Yup.InferType<typeof createTokenSchema>;
