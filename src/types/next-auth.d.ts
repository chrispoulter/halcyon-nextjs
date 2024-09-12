/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { type DefaultSession } from 'next-auth';
import { Role } from '@/lib/roles';

declare module 'next-auth' {
    interface User {
        accessToken: string;
        id: string;
        emailAddress: string;
        firstName: string;
        lastName: string;
        roles?: Role[];
    }

    interface Session {
        accessToken: string;
        user: {
            roles?: Role[];
        } & DefaultSession['user'];
    }
}

import { JWT } from "next-auth/jwt"

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        roles?: Role[];
    }
}
