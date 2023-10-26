import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: number;
        emailAddress: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        roles?: string[];
    }

    interface Session {
        user: {
            roles?: string[];
        } & DefaultUser;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        roles?: string[];
    }
}
