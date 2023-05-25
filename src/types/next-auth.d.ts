import { DefaultUser } from 'next-auth';
import { Role } from '@/utils/auth';

declare module 'next-auth' {
    interface User {
        id: number;
        emailAddress: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        roles?: Role[];
    }

    interface Session {
        user: {
            roles?: Role[];
        } & DefaultUser;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        roles?: Role[];
    }
}
