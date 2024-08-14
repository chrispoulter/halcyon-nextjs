import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface User {
        accessToken: string;
        id: string;
        emailAddress: string;
        firstName: string;
        lastName: string;
        roles?: string[];
    }

    interface Session {
        accessToken: string;
        user: {
            roles?: string[];
        } & DefaultUser;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        roles?: string[];
    }
}
