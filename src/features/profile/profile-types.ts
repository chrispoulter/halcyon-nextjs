export type GetProfileResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version: number;
};

export type UpdateProfileRequest = {
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version?: number;
};

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
    version?: number;
};

export type DeleteAccountRequst = { version?: number };
