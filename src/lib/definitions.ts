export type SessionPayload = {
    accessToken: string;
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    roles?: string[];
};
