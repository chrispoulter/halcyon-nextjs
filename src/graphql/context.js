const { AuthenticationError, ForbiddenError } = require('apollo-server');
const { skip } = require('graphql-resolvers');
const { verifyToken } = require('../utils/jwt');
const { isAuthorized } = require('../utils/auth');

module.exports.context = async ({ req, event, connection }) => {
    if (connection) {
        return connection.context;
    }

    const headers = (req || event).headers;
    const authHeader = headers.authorization || headers.Authorization || '';

    const token = authHeader.replace(/bearer /giu, '');
    if (!token) {
        return {};
    }

    const payload = await verifyToken(token);
    return {
        payload
    };
};

module.exports.subscriptions = {
    onConnect: async connectionParams => {
        const authHeader = connectionParams.authToken || '';

        const token = authHeader.replace(/bearer /giu, '');
        if (!token) {
            return {};
        }

        const payload = await verifyToken(token);
        return {
            payload
        };
    }
};

module.exports.isAuthenticated = requiredRoles => (_, __, { payload }) => {
    if (!payload) {
        return new AuthenticationError('The token provided was invalid.');
    }

    const authorized = isAuthorized(payload, requiredRoles);
    if (!authorized) {
        return new ForbiddenError(
            'You are not authorized to view this resource.'
        );
    }

    return skip;
};
