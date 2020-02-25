const { AuthenticationError, ForbiddenError } = require('apollo-server');
const { skip } = require('graphql-resolvers');
const { verifyToken } = require('../utils/jwt');

module.exports = async ({ headers }) => {
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

const isAuthorized = (user, requiredRoles) => {
    if (!user) {
        return false;
    }
    if (!requiredRoles) {
        return true;
    }

    if (!user.role) {
        return false;
    }

    const userRoles = user.role || [];
    if (!requiredRoles.some(value => userRoles.includes(value))) {
        return false;
    }

    return true;
};

module.exports.isAuthenticated = (_, __, { payload }) => {
    if (!isAuthorized(payload)) {
        throw new AuthenticationError(
            'You are not authorized to view this resource.'
        );
    }

    return skip;
};

module.exports.isUserAdministrator = (_, __, { payload }) => {
    if (
        !isAuthorized(payload, ['System Administrator', 'User Administrator'])
    ) {
        throw new ForbiddenError(
            'You are not authorized to view this resource.'
        );
    }

    return skip;
};
