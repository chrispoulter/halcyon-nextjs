import { InferType, object, string } from 'yup';

export const createTokenSchema = object().shape({
    emailAddress: string().label('Email Address').email().required(),
    password: string().label('Password').required()
});

export type CreateTokenRequest = InferType<typeof createTokenSchema>;
