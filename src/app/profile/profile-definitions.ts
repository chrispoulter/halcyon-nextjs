export type GetProfileResponse = {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    version: string;
};

export type UpdateProfileResponse = {
    id: string;
};

export type ChangePasswordResponse = {
    id: string;
};

export type DeleteAccountResponse = {
    id: string;
};
