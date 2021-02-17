import { ApolloServer } from 'apollo-server-lambda';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context } from './context';
import { initializeLogger, wrapHandler } from './utils/logger';

initializeLogger();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: true
});

export const handler = wrapHandler(
    server.createHandler({
        cors: {
            origin: '*',
            credentials: true
        }
    })
);
