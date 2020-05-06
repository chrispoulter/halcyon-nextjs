const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers, context, subscriptions } = require('./graphql');
const { loggerPlugin } = require('./utils/logger');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    subscriptions,
    plugins: [loggerPlugin],
    introspection: true,
    playground: true
});

server
    .listen({ port: process.env.PORT || 3001 })
    .then(({ url, subscriptionsUrl }) => {
        console.log(`Server ready at ${url}`);
        console.log(`Subscriptions ready at ${subscriptionsUrl}`);
    });
