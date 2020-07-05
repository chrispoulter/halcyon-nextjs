const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers, context } = require('./schema');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: true
});

server.listen({ port: process.env.PORT || 3001 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
