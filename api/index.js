import { ApolloServer } from 'apollo-server-lambda';
import { UserRepository } from './dataSources';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context } from './context';
import { initializeLogger, formatError } from './utils/logger';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: true,
    playground: true,
    formatError,
    dataSources: () => ({
        users: new UserRepository()
    })
});

export const handler = initializeLogger(
    server.createHandler({
        cors: {
            origin: '*',
            credentials: true
        }
    })
);
