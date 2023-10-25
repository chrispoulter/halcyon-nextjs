import { Users } from '@prisma/client';
import { encode } from 'next-auth/jwt';
import { config } from '@/utils/config';

type JwtTokenUser = Pick<
    Users,
    'id' | 'emailAddress' | 'firstName' | 'lastName' | 'roles'
>;

export const generateJwtToken = async (user: JwtTokenUser) =>
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
