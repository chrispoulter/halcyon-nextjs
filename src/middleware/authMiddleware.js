import { verifyToken } from '@/utils/jwt';
import { isAuthorized } from '@/utils/auth';

export const authMiddleware = requiredRoles => async (req, res, next) => {
    const authorization =
        req.headers['authorization'] || req.headers['Authorization'];

    const token = authorization?.replace(/bearer /giu, '');

    if (!token) {
        return res.status(401).end();
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return res.status(401).end();
    }

    const authorized = isAuthorized(payload, requiredRoles);
    if (!authorized) {
        return res.status(403).end();
    }

    req.payload = payload;

    return await next();
};
