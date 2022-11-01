import { sign, verify } from 'jsonwebtoken';
import { config } from './config';

export const verifyToken = async token => {
    try {
        return verify(token, config.JWT_SECURITY_KEY, {
            issuer: config.JWT_ISSUER,
            audience: config.JWT_AUDIENCE
        });
    } catch (error) {
        // ignore errors
        return undefined;
    }
};

export const generateToken = user => {
    const payload = {
        sub: user.user_id,
        email: user.email_address,
        given_name: user.first_name,
        family_name: user.last_name,
        role: (user.user_roles || []).map(ur => ur.roles.name).join()
    };

    const expiresIn = config.JWT_EXPIRES_IN;

    const accessToken = sign(payload, config.JWT_SECURITY_KEY, {
        issuer: config.JWT_ISSUER,
        audience: config.JWT_AUDIENCE,
        expiresIn
    });

    return {
        accessToken,
        expiresIn
    };
};
