import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { verifyToken } from './utils/jwt';
import { isAuthorized } from './utils/auth';

export const context = async ({ req, event }) => {
    const request = req || event;

    const authorization = request.headers['authorization'] || [];
    const transactionId = request.headers['x-transaction-id'];

    const token = authorization.replace(/bearer /giu, '');
    if (!token) {
        return { transactionId };
    }

    const payload = await verifyToken(token);
    return {
        payload,
        transactionId
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

    const authorized = isAuthorized(payload, requiredRoles);
    if (!authorized) {
        throw new ForbiddenError(
            'You are not authorized to view this resource.'
        );
    }

    return resolverFn(parent, args, context, info);
};
