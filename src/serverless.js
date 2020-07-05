const { ApolloServer } = require('apollo-server-lambda');
const { typeDefs, resolvers, context } = require('./graphql');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
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
