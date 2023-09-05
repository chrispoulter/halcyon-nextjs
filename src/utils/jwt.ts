import { Users } from '@prisma/client';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { config } from '@/utils/config';

export const verifyToken = (token: string) => {
    try {
        return verify(token, config.JWT_SECURITY_KEY, {
            issuer: config.JWT_ISSUER,
            audience: config.JWT_AUDIENCE
        }) as JwtPayload;
    } catch (error) {
        // ignore errors
        return undefined;
    }
};

export const generateToken = (user: Users) =>
    sign(
        {
            sub: user.id.toString(),
            email: user.emailAddress,
            given_name: user.firstName,
            family_name: user.lastName,
            roles: user.roles
        },
        config.JWT_SECURITY_KEY,
        {
            issuer: config.JWT_ISSUER,
            audience: config.JWT_AUDIENCE,
            expiresIn: config.JWT_EXPIRES_IN
        }
    );
