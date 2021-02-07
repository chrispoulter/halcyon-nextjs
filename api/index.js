import { ApolloServer } from 'apollo-server-lambda';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context } from './context';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: true
});

export const handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    }
});
