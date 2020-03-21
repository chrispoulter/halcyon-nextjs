const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers, context } = require('./graphql');
const { openConnection } = require('./utils/mongo');

openConnection();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
});

server
    .listen({ port: process.env.PORT || 3001 })
    .then(({ url }) => console.log(`Server ready at ${url}`));
