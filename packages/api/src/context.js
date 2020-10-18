const { AuthenticationError, ForbiddenError } = require('apollo-server');
const { verifyToken } = require('./utils/jwt');
const { isAuthorized } = require('./utils/auth');

module.exports = async ({ req, event }) => {
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

module.exports.isAuthenticated = (resolverFn, requiredRoles) => (
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
