export type ApiTokenPayload = {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    roles?: string | string[];
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
