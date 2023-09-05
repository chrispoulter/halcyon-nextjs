import { DefaultUser } from 'next-auth';
import { Role } from '@/utils/auth';

declare module 'next-auth' {
    interface User {
        accessToken: string;
        email: string;
        given_name: string;
        family_name: string;
        accessToken: string;
        roles?: Role[];
    }

    interface Session {
        accessToken?: string;
        user: {
            roles?: Role[] | null;
        } & DefaultUser;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        roles?: Role[] | null;
    }
}
