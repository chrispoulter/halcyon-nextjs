const {
    PubSub,
    AuthenticationError,
    ForbiddenError
} = require('apollo-server');
const { skip } = require('graphql-resolvers');
const { verifyToken } = require('../utils/jwt');
const { isAuthorized } = require('../utils/auth');

const pubsub = new PubSub();

module.exports.context = async ({ req, connection }) => {
    if (connection) {
        return connection.context;
    }

    const authHeader =
        req.headers.authorization || req.headers.Authorization || '';

    const token = authHeader.replace(/bearer /giu, '');
    if (!token) {
        return { pubsub };
    }

    const payload = await verifyToken(token);
    return {
        payload,
        pubsub
    };
};

module.exports.subscriptions = {
    onConnect: async params => {
        const authHeader = params.authorization || params.Authorization || '';

        const token = authHeader.replace(/bearer /giu, '');
        if (!token) {
            return { pubsub };
        }

        const payload = await verifyToken(token);
        return {
            payload,
            pubsub
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
