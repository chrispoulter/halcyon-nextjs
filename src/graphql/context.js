const { AuthenticationError } = require('apollo-server');
const { skip } = require('graphql-resolvers');
const { verifyToken } = require('../utils/jwt');
const { isAuthorized, isUserAdministrator } = require('../utils/auth');

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

module.exports.isAuthenticated = (_, __, { payload }) =>
    isAuthorized(payload)
        ? skip
        : new AuthenticationError(
              'You are not authorized to view this resource.'
          );

module.exports.isUserAdministrator = (_, __, { payload }) =>
    isAuthorized(payload, isUserAdministrator)
        ? skip
        : new AuthenticationError(
              'You are not authorized to view this resource.'
          );
