const { ApolloServer } = require('apollo-server-lambda');
const { typeDefs, resolvers, context } = require('./graphql');
const { plugin } = require('./utils/logger');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    plugins: [plugin],
    introspection: true,
    playground: true
});

const handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    }
});

module.exports.handler = handler;
