import { Role } from '@/lib/session-types';

export type TokenPayload = {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    roles?: Role | Role[];
};

export type LoginResponse = {
    accessToken: string;
};

export type RegisterResponse = {
    id: string;
};

export type ResetPasswordResponse = {
    id: string;
};
