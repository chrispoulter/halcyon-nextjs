import { encode } from 'next-auth/jwt';
import { User } from './db';
import { config } from './config';

export const generateJwtToken = async (user: User) =>
    encode({
        secret: config.NEXTAUTH_SECRET,
        maxAge: config.NEXTAUTH_SESSION_MAXAGE,
        token: {
            sub: user.id.toString(),
            email: user.email_address,
            given_name: user.first_name,
            family_name: user.last_name,
            jti: crypto.randomUUID(),
            roles: user.roles
        }
    });
