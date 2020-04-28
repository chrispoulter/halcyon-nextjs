const { ApolloServer } = require('apollo-server-lambda');
const { typeDefs, resolvers, context } = require('./graphql');
const { openConnection } = require('./utils/mongo');
const { plugin } = require('./utils/logger');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [plugin]
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
