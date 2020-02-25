const { AuthenticationError } = require('apollo-server');
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

module.exports.isAuthenticated = (_, __, { payload }) =>
    isAuthorized(payload)
        ? skip
        : new AuthenticationError(
              'You are not authorized to view this resource.'
          );

module.exports.isUserAdministrator = (_, __, { payload }) =>
    isAuthorized(payload, ['System Administrator', 'User Administrator'])
        ? skip
        : new AuthenticationError(
              'You are not authorized to view this resource.'
          );
