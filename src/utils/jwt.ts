import { encode } from 'next-auth/jwt';
import { config } from './config';

type JwtUser = {
    id: number;
    emailAddress: string;
    firstName: string;
    lastName: string;
    roles?: string[];
};

export const generateJwtToken = async (user: JwtUser) =>
    encode({
        secret: config.NEXTAUTH_SECRET,
        maxAge: config.NEXTAUTH_SESSION_MAXAGE,
        token: {
            sub: user.id.toString(),
            email: user.emailAddress,
            given_name: user.firstName,
            family_name: user.lastName,
            jti: crypto.randomUUID(),
            roles: user.roles
        }
    });
