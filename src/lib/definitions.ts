export enum Role {
    SYSTEM_ADMINISTRATOR = 'SYSTEM_ADMINISTRATOR',
    USER_ADMINISTRATOR = 'USER_ADMINISTRATOR',
}

export type SessionPayload = {
    accessToken: string;
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    roles?: Role[];
};
