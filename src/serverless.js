const { ApolloServer } = require('apollo-server-lambda');
const { schema, resolvers, context, subscriptions } = require('./graphql');
const { openConnection } = require('./utils/mongo');

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context,
    subscriptions
});

const graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    }
});

module.exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    openConnection().then(() => {
        graphqlHandler(event, context, callback);
    });
};
