const { ApolloServer } = require('apollo-server');
const { schema, resolvers, context } = require('./graphql');
const { openConnection } = require('./utils/mongo');

openConnection();

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: ({ req }) => context({ headers: req.headers })
});

server
    .listen({ port: process.env.PORT || 3001 })
    .then(({ url }) => console.log(`Server ready at ${url}`));
