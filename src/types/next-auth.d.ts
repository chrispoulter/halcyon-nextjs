import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface User {
        id: number;
        emailAddress: string;
        firstName: string;
        lastName: string;
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
