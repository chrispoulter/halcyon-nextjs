const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { context, subscriptions } = require('./context');

module.exports = { typeDefs, resolvers, context, subscriptions };
