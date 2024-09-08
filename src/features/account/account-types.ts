export type RegisterRequest = {
    emailAddress: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
};

export type ForgotPasswordRequest = { emailAddress: string; siteUrl: string };

export type ResetPasswordRequest = {
    token: string;
    emailAddress: string;
    newPassword: string;
};
