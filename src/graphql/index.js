const schema = require('./schema');
const resolvers = require('./resolvers');
const { context, subscriptions } = require('./context');

module.exports = { schema, resolvers, context, subscriptions };
