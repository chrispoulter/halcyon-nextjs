const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers, context, subscriptions } = require('./graphql');
const { openConnection } = require('./utils/mongo');

openConnection();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    subscriptions
});

server
    .listen({ port: process.env.PORT || 3001 })
    .then(({ url, subscriptionsUrl }) => {
        console.log(`Server ready at ${url}`);
        console.log(`Subscriptions ready at ${subscriptionsUrl}`);
    });
