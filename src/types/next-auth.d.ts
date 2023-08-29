import { DefaultUser } from 'next-auth';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '@/utils/auth';

declare module 'next-auth' {
    interface User {
        accessToken: string;
        decodedToken: JwtPayload;
    }

    interface Session {
        accessToken: string;
        user: {
            roles?: Role[] | null;
        } & DefaultUser;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        roles?: Role[] | null;
    }
}
