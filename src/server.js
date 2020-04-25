const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers, context, subscriptions } = require('./graphql');
const { openConnection } = require('./utils/mongo');
const logger = require('./utils/logger');

logger.initialize();
openConnection();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    subscriptions,
    formatError: logger.formatError
});

server
    .listen({ port: process.env.PORT || 3001 })
    .then(({ url, subscriptionsUrl }) => {
        logger.log(`Server ready at ${url}`);
        logger.log(`Subscriptions ready at ${subscriptionsUrl}`);
    });
