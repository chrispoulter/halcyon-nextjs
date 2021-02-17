import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { verifyToken } from './utils/jwt';
import { isAuthorized } from './utils/auth';
import { setUser } from './utils/logger';

export const context = async ({ req, event }) => {
    const request = req || event;

    const authHeader =
        request.headers.authorization || request.headers.Authorization || '';

    const token = authHeader.replace(/bearer /giu, '');
    if (!token) {
        return {};
    }

    const payload = await verifyToken(token);
    return {
        payload
    };
};

export const isAuthenticated = (resolverFn, requiredRoles) => (
    parent,
    args,
    context,
    info
) => {
    const { payload } = context;

    if (!payload) {
        throw new AuthenticationError('The token provided was invalid.');
    }

    setUser(payload);

    const authorized = isAuthorized(payload, requiredRoles);
    if (!authorized) {
        throw new ForbiddenError(
            'You are not authorized to view this resource.'
        );
    }

    return resolverFn(parent, args, context, info);
};
