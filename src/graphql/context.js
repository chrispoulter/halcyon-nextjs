const { AuthenticationError, ForbiddenError } = require('apollo-server');
const { skip } = require('graphql-resolvers');
const { verifyToken } = require('../utils/jwt');
const { isAuthorized, isUserAdministrator } = require('../utils/auth');

module.exports = async ({ req, event, connection }) => {
    if (connection) {
        return undefined;
    }

    const headers = (req || event).headers;
    const authHeader = headers.authorization || headers.Authorization || '';

    const token = authHeader.replace(/bearer /giu, '');
    if (!token) {
        return undefined;
    }

    const payload = await verifyToken(token);
    return {
        payload
    };
};

module.exports.isAuthenticated = (_, __, { payload }) => {
    if (!payload) {
        return new AuthenticationError('The token provided was invalid.');
    }

    return skip;
};

module.exports.isUserAdministrator = (_, __, { payload }) => {
    if (!payload) {
        return new AuthenticationError('The token provided was invalid.');
    }

    const authorized = isAuthorized(payload, isUserAdministrator);
    if (!authorized) {
        return new ForbiddenError(
            'You are not authorized to view this resource.'
        );
    }

    return skip;
};
