import { Role } from '@/lib/session-definitions';

export type LoginResponse = {
    accessToken: string;
};

export type JwtPayload = {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    roles?: Role | Role[];
};

export type RegisterResponse = {
    id: string;
};

export type ResetPasswordResponse = {
    id: string;
};
